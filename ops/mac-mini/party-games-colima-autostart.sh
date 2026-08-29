#!/bin/bash
set -Eeuo pipefail

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

PROFILE=party-games
LOG=/Users/jerry/Library/Logs/party-games-colima-autostart.log
DOCKER_HOST=unix:///Users/jerry/.colima/party-games/docker.sock

mkdir -p "$(dirname "$LOG")"
printf '[%s] Party Games Colima autostart triggered\n' "$(date)" >> "$LOG"

if colima status --profile "$PROFILE" 2>&1 | grep -q "is running"; then
  printf '[%s] Party Games Colima is already running.\n' "$(date)" >> "$LOG"
  exit 0
fi

colima stop --profile "$PROFILE" --force >> "$LOG" 2>&1 || true
sleep 3

if ! colima start \
  --profile "$PROFILE" \
  --activate=false \
  --cpu 2 \
  --memory 2 \
  --disk 20 \
  --port-forwarder none \
  --mount-inotify=false \
  --mount none >> "$LOG" 2>&1; then
  printf '[%s] ERROR: Party Games Colima failed to start.\n' "$(date)" >> "$LOG"
  exit 1
fi

for _ in $(seq 1 30); do
  if DOCKER_HOST="$DOCKER_HOST" docker info >/dev/null 2>&1; then
    count=$(DOCKER_HOST="$DOCKER_HOST" docker ps -q 2>/dev/null | wc -l | tr -d ' ')
    printf '[%s] Party Games Docker is ready with %s running containers.\n' "$(date)" "$count" >> "$LOG"
    exit 0
  fi
  sleep 2
done

printf '[%s] ERROR: Party Games Docker did not become ready.\n' "$(date)" >> "$LOG"
exit 1
