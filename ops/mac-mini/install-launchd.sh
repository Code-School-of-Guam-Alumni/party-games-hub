#!/bin/bash
set -Eeuo pipefail

if [[ $(id -u) -eq 0 ]]; then
  echo "Run this script as jerry; it uses sudo only for LaunchDaemon installation." >&2
  exit 1
fi

SERVICE_DIR=${PARTY_GAMES_SERVICE_DIR:-/Users/jerry/services/party-games-hub}
LAUNCHD_DIR="$SERVICE_DIR/ops/mac-mini/launchd"
BACKUP_DIR="/Volumes/T9/Backups/mac-mini-retirements/$(date +%Y%m%dT%H%M%S)-party-games-launchd"

mkdir -p "$BACKUP_DIR"

for label in \
  com.shimizu.colima-autostart \
  com.shimizu.party-games-deploy \
  com.shimizu.party-games-backup \
  com.shimizu.party-games-tunnel; do
  source_plist="$LAUNCHD_DIR/$label.plist"
  destination_plist="/Library/LaunchDaemons/$label.plist"

  if sudo test -f "$destination_plist"; then
    sudo cp -p "$destination_plist" "$BACKUP_DIR/"
    sudo launchctl bootout system "$destination_plist" 2>/dev/null || true
  fi

  sudo install -o root -g wheel -m 0644 "$source_plist" "$destination_plist"
  sudo plutil -lint "$destination_plist"
  sudo launchctl bootstrap system "$destination_plist"
done

# Party Games uses its own boot-safe profile. The default Colima profile still
# starts at login because Immich needs the external T9 share, which macOS does
# not permit Virtualization.framework to attach before console login.
launchctl enable "gui/$(id -u)/homebrew.mxcl.colima" || true

echo "Installed Party Games boot services; the Immich Colima login agent remains enabled."
