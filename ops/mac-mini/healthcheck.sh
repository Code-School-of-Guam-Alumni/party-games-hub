#!/bin/bash
set -Eeuo pipefail

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin

SERVICE_DIR=${PARTY_GAMES_SERVICE_DIR:-/Users/jerry/services/party-games-hub}
ENV_FILE="$SERVICE_DIR/.env.production"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

base_url="http://127.0.0.1:${PARTY_GAMES_PORT:-8787}"

curl --fail --silent --show-error --max-time 10 "$base_url/healthz" >/dev/null
curl --fail --silent --show-error --max-time 10 "$base_url/up" >/dev/null
curl --fail --silent --show-error --max-time 10 "$base_url/api/v1/games" >/dev/null

echo "Party Games health checks passed."
