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

# The boot daemon replaces the login-only Homebrew LaunchAgent.
launchctl bootout "gui/$(id -u)" "$HOME/Library/LaunchAgents/homebrew.mxcl.colima.plist" 2>/dev/null || true
launchctl disable "gui/$(id -u)/homebrew.mxcl.colima" || true

echo "Installed Party Games and Colima boot services."
