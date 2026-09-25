#!/usr/bin/env bash
set -euo pipefail

# Run this from a dev machine (NOT the EC2 instance -- see the note at the
# top of setup.sh for why) whenever the app code changes and you want that
# picked up on the instance. Builds the image and pushes it to Docker Hub;
# the instance then just pulls it (`sudo docker compose pull app &&
# sudo docker compose up -d app`, or simply re-running setup.sh).
#
# Requires `docker login` to already be done on this machine.
#
# Usage: bash deploy/build-and-push.sh [image]
#   image  defaults to ianmisik/food-logbook-new:latest -- must match
#          DOCKER_IMAGE in the instance's .env (or the default in
#          docker-compose.yml) or it'll pull the wrong thing.

IMAGE="${1:-ianmisik/food-logbook-new:latest}"

cd "$(dirname "$0")/.."

echo "==> Building $IMAGE"
docker build -t "$IMAGE" .

echo "==> Pushing $IMAGE"
docker push "$IMAGE"

echo
echo "==> Done. On the instance, run:"
echo "    cd ~/food-logbook-new && sudo docker compose pull app && sudo docker compose up -d app"
