#!/usr/bin/env bash
set -euo pipefail

# One-shot provisioning for a fresh EC2 instance (Ubuntu 24.04/26.04 LTS,
# full or Minimal -- both apt-based, nothing here depends on anything
# beyond base Ubuntu + apt). Installs Docker, clones/updates this repo,
# brings up the full stack (app + its own Postgres, see docker-compose.yml)
# via Docker Compose, and fronts the app with Nginx on port 80 so it's
# never exposed directly to the internet. The database is NOT external
# (no Railway/Neon/etc) -- it runs in its own container on this same
# instance, with its data in a persistent Docker volume.
#
# The app image is PULLED from Docker Hub, not built here -- this app's
# build (Vite + esbuild) needs more RAM than a small instance comfortably
# has, and building it in place has been observed to exhaust memory and
# hang the whole instance. To publish a new version after code changes,
# run deploy/build-and-push.sh from a dev machine first, then re-run this
# script (or just `git pull && sudo docker compose pull app && sudo
# docker compose up -d app`) on the instance to pick it up.
#
# Idempotent -- safe to re-run after a `git pull` to pick up new commits,
# or if a step failed partway through the first time. It will not re-seed
# or overwrite a database that already has data in it.
#
# Usage: bash deploy/setup.sh [repo_url] [server_name]
#   repo_url     defaults to this project's GitHub URL
#   server_name  Nginx server_name -- your domain if you have one, or
#                omit it to match any Host header (fine for an IP-only
#                demo; tighten this once you point a real domain at it)
#
# To bring an existing database over (e.g. migrating off Railway), scp a
# pg_dump custom-format file to the instance BEFORE running this script:
#   scp your_backup.dump ubuntu@<instance>:~/food-logbook-new-seed.dump
# It will be restored automatically on first run if present. Without it,
# the app starts with an empty schema (created via `drizzle-kit push`).

REPO_URL="${1:-https://github.com/IanMIsik/food-logbook-new.git}"
SERVER_NAME="${2:-_}"
APP_DIR="$HOME/food-logbook-new"
SEED_DUMP="$HOME/food-logbook-new-seed.dump"
APP_PORT=5000  # matches docker-compose.yml's "5000:5000" and server/index.ts's PORT default

echo "==> Installing Docker + Nginx"
sudo apt update
sudo apt install -y ca-certificates curl nginx
if ! command -v docker >/dev/null 2>&1; then
  # Docker's own official convenience script -- installs Engine + the
  # `docker compose` plugin together, which is all this needs.
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
  echo "NOTE: added $USER to the docker group -- that only takes effect in a NEW login session."
  echo "      This script still works right now (it uses sudo for docker below), but for"
  echo "      sudo-less 'docker compose ...' afterwards, log out and back in first."
fi

echo "==> Cloning/updating the repo"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

if [ ! -f .env ]; then
  echo "==> Generating .env with a random database password"
  DB_PASSWORD="$(openssl rand -hex 24)"
  cat > .env <<EOF
DB_PASSWORD=$DB_PASSWORD
EOF
  chmod 600 .env
fi

echo "==> Starting the database"
sudo docker compose up -d db
echo "    Waiting for Postgres to become healthy..."
ready=""
for i in $(seq 1 30); do
  if sudo docker compose exec -T db pg_isready -U food_logbook -d food_logbook < /dev/null >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done
if [ -z "$ready" ]; then
  echo "Postgres did not become healthy in time -- check 'sudo docker compose logs db'"
  exit 1
fi

set -a; source .env; set +a
# `< /dev/null` on every `docker compose exec` below is load-bearing, not
# style: sudo's `use_pty` setting (Ubuntu's default) allocates a fresh pty
# for each of these, and without stdin explicitly closed off, the nested
# docker-compose subprocess can end up backgrounded relative to that new
# pty and get SIGTTIN-stopped trying to read from it -- it then hangs
# forever (visible as state "T" in `ps aux`), not because of anything slow
# in Postgres itself. Confirmed by reproducing this exact hang 3 times.
SCHEMA_EXISTS="$(sudo docker compose exec -T db psql -U food_logbook -d food_logbook -tAc \
  "select 1 from information_schema.tables where table_name = 'foods'" < /dev/null || true)"

if [ "$SCHEMA_EXISTS" != "1" ]; then
  if [ -f "$SEED_DUMP" ]; then
    echo "==> Empty database, found $SEED_DUMP -- restoring it"
    sudo docker compose cp "$SEED_DUMP" db:/tmp/seed.dump
    sudo docker compose exec -T db pg_restore -U food_logbook -d food_logbook \
      --no-owner --no-privileges /tmp/seed.dump < /dev/null
    sudo docker compose exec -T db rm /tmp/seed.dump < /dev/null
  else
    echo "==> Empty database, no seed dump found -- creating schema from scratch"
    # drizzle-kit is a devDependency, not present in the app's runtime image,
    # so this runs it via the intermediate build stage instead.
    sudo docker build --target builder -t food-logbook-builder .
    sudo docker run --rm --network "$(basename "$APP_DIR")_default" \
      -e DATABASE_URL="postgresql://food_logbook:${DB_PASSWORD}@db:5432/food_logbook" \
      food-logbook-builder npx drizzle-kit push --force < /dev/null
  fi
else
  echo "==> Database already has data -- leaving it as-is"
fi

echo "==> Pulling and starting the app container"
sudo docker compose pull app
sudo docker compose up -d app

echo "==> Configuring Nginx reverse proxy (port 80 -> 127.0.0.1:$APP_PORT)"
sudo tee /etc/nginx/sites-available/food-logbook > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/food-logbook /etc/nginx/sites-enabled/food-logbook
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

echo
echo "==> Done. Should be reachable at http://<this instance's public IP or domain>/"
echo "    (make sure your EC2 security group allows inbound port 80 from 0.0.0.0/0)"
echo
echo "    Container status: sudo docker compose ps"
echo "    Logs:             sudo docker compose logs -f"
echo "    DB backups:       sudo docker compose exec db pg_dump -U food_logbook -Fc food_logbook > backup.dump"
echo
echo "==> For HTTPS, once a real domain's DNS points at this instance's IP:"
echo "    sudo apt install -y certbot python3-certbot-nginx"
echo "    sudo certbot --nginx -d yourdomain.example"
