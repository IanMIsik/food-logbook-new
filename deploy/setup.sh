#!/usr/bin/env bash
set -euo pipefail

# One-shot provisioning for a fresh EC2 instance (Ubuntu 24.04/26.04 LTS,
# full or Minimal -- both apt-based, nothing here depends on anything
# beyond base Ubuntu + apt). Installs Docker, clones/updates this repo,
# brings the app up via docker-compose.yml, and fronts it with Nginx on
# port 80 so the Node app itself is never exposed directly to the internet.
#
# Idempotent -- safe to re-run after a `git pull` to rebuild and pick up
# new commits, or if a step failed partway through the first time.
#
# Usage: bash deploy/setup.sh [repo_url] [server_name]
#   repo_url     defaults to this project's GitHub URL
#   server_name  Nginx server_name -- your domain if you have one, or
#                omit it to match any Host header (fine for an IP-only
#                demo; tighten this once you point a real domain at it)

REPO_URL="${1:-https://github.com/IanMIsik/food-logbook-new.git}"
SERVER_NAME="${2:-_}"
APP_DIR="$HOME/food-logbook-new"
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
  echo "==> No .env found -- writing a template. Fill in DATABASE_URL before continuing."
  cat > .env <<'EOF'
# Required. Connection string for the app's Postgres database
# (e.g. Railway's DATABASE_PUBLIC_URL, or the internal one if this
# instance ever ends up on the same private network as the DB).
DATABASE_URL=
EOF
  echo "    Edit $APP_DIR/.env now, then re-run this script."
  exit 1
fi

echo "==> Building and starting the app container"
sudo docker compose up -d --build

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
echo
echo "==> For HTTPS, once a real domain's DNS points at this instance's IP:"
echo "    sudo apt install -y certbot python3-certbot-nginx"
echo "    sudo certbot --nginx -d yourdomain.example"
