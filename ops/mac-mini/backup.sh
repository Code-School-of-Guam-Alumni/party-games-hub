#!/bin/bash
set -Eeuo pipefail

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin

SERVICE_DIR=${PARTY_GAMES_SERVICE_DIR:-/Users/jerry/services/party-games-hub}
COMPOSE_FILE="$SERVICE_DIR/compose.production.yml"
ENV_FILE="$SERVICE_DIR/.env.production"
BACKUP_KIND=${1:-scheduled}
DOCKER_BIN=${DOCKER_BIN:-docker}

cd "$SERVICE_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

backup_dir=${PARTY_GAMES_BACKUP_DIR:-/Volumes/T9/Backups/party-games-hub/postgres}

if [[ "$backup_dir" == /Volumes/T9/* ]] && ! /sbin/mount | grep -Fq ' on /Volumes/T9 '; then
  echo "T9 is not mounted; refusing to write a backup into the system-disk mount point." >&2
  exit 1
fi

mkdir -p "$backup_dir"

timestamp=$(date -u +%Y%m%dT%H%M%SZ)
destination="$backup_dir/${BACKUP_KIND}-${timestamp}.dump.gz"
temporary="$destination.tmp"
trap 'rm -f "$temporary"' EXIT

if ! "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --status running db --quiet | grep -q .; then
  echo "Party Games database is not running; no backup was created." >&2
  exit 1
fi

umask 077
"$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T db \
  pg_dump --format=custom --no-owner --no-privileges \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" |
  gzip -9 > "$temporary"

gzip -t "$temporary"
mv "$temporary" "$destination"
trap - EXIT

echo "Created $destination"
