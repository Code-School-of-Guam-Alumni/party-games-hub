#!/bin/bash
set -Eeuo pipefail

SOURCE_DIR=${PARTY_GAMES_BACKUP_DIR:-/Users/jerry/Backups/party-games-hub/postgres}
DESTINATION_DIR=${PARTY_GAMES_T9_ARCHIVE_DIR:-/Volumes/T9/Backups/party-games-hub/postgres}
temporary=""

cleanup() {
  if [[ -n "$temporary" && -f "$temporary" ]]; then
    rm -f "$temporary"
  fi
}
trap cleanup EXIT INT TERM

if ! /sbin/mount | grep -Fq ' on /Volumes/T9 '; then
  echo "T9 is not mounted; refusing to create an archive on the internal disk." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Missing automatic backup directory: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$DESTINATION_DIR"
shopt -s nullglob
sources=("$SOURCE_DIR"/*.dump.gz)

for source in "${sources[@]}"; do
  destination="$DESTINATION_DIR/$(basename "$source")"
  if [[ -f "$destination" ]]; then
    if ! cmp -s "$source" "$destination"; then
      echo "Archive collision with different contents: $destination" >&2
      exit 1
    fi
    continue
  fi

  temporary="${destination}.tmp.$$"
  cp -p "$source" "$temporary"
  gzip -t "$temporary"
  cmp -s "$source" "$temporary"
  mv "$temporary" "$destination"
  chmod 600 "$destination"
  temporary=""
  echo "Archived $(basename "$source")"
done

echo "Party Games T9 backup archive is synchronized and verified."
