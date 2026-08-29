#!/bin/bash
set -Eeuo pipefail

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

PROFILE=party-games
LOCAL_PORT=${PARTY_GAMES_PORT:-8787}
SSH_CONFIG="/Users/jerry/.colima/_lima/colima-${PROFILE}/ssh.config"
SSH_HOST="lima-colima-${PROFILE}"

for _ in $(seq 1 120); do
  if [[ -f "$SSH_CONFIG" ]] && \
     colima status --profile "$PROFILE" 2>&1 | grep -q "is running" && \
     /usr/bin/ssh -F "$SSH_CONFIG" \
       -o ControlMaster=no \
       -o ControlPath=none \
       -o ConnectTimeout=5 \
       "$SSH_HOST" true >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if [[ ! -f "$SSH_CONFIG" ]]; then
  echo "Party Games Colima SSH configuration did not become available." >&2
  exit 1
fi

# Colima's event-driven host forwarding has failed to restore published ports
# after VM restarts on this host. Keep one explicit TCP tunnel instead. The VM
# itself publishes 127.0.0.1:8787, so this forwards only that loopback origin
# and never exposes the application to the LAN.
exec /usr/bin/ssh -F "$SSH_CONFIG" \
  -o ControlMaster=no \
  -o ControlPath=none \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=3 \
  -N \
  -L "127.0.0.1:${LOCAL_PORT}:127.0.0.1:${LOCAL_PORT}" \
  "$SSH_HOST"
