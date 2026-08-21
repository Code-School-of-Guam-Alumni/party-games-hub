#!/bin/bash
set -Eeuo pipefail

export HOME=/Users/jerry
export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

PROFILE=party-games
LOG=/Users/jerry/Library/Logs/party-games-colima-autostart.log
DOCKER_HOST=unix:///Users/jerry/.colima/party-games/docker.sock

mkdir -p "$(dirname "$LOG")"
printf '[%s] Party Games Colima autostart triggered\n' "$(date)" >> "$LOG"

# The external T9 is intentionally not shared into this VM. macOS can expose
# it to the host backup script without giving the app runtime access to Immich
# data. External disks may enumerate a few seconds after launchd starts, so
# mount it concurrently while Colima boots.
mount_t9() {
  for _ in $(seq 1 90); do
    if /sbin/mount | grep -Fq ' on /Volumes/T9 '; then
      printf '[%s] T9 is mounted for database backups.\n' "$(date)" >> "$LOG"
      return 0
    fi

    if /usr/sbin/diskutil mount T9 >/dev/null 2>&1; then
      printf '[%s] T9 mounted for database backups.\n' "$(date)" >> "$LOG"
      return 0
    fi
    sleep 2
  done

  printf '[%s] WARNING: T9 did not mount; app startup will continue and backups will fail safely.\n' "$(date)" >> "$LOG"
  return 0
}

mount_t9 &
mount_pid=$!

if colima status --profile "$PROFILE" 2>&1 | grep -q "is running"; then
  printf '[%s] Party Games Colima is already running.\n' "$(date)" >> "$LOG"
  wait "$mount_pid"
  exit 0
fi

colima stop --profile "$PROFILE" --force >> "$LOG" 2>&1 || true
sleep 3

if ! colima start \
  --profile "$PROFILE" \
  --cpu 2 \
  --memory 2 \
  --disk 20 \
  --mount-inotify=false \
  --mount none >> "$LOG" 2>&1; then
  printf '[%s] ERROR: Party Games Colima failed to start.\n' "$(date)" >> "$LOG"
  wait "$mount_pid"
  exit 1
fi

for _ in $(seq 1 30); do
  if DOCKER_HOST="$DOCKER_HOST" docker info >/dev/null 2>&1; then
    count=$(DOCKER_HOST="$DOCKER_HOST" docker ps -q 2>/dev/null | wc -l | tr -d ' ')
    printf '[%s] Party Games Docker is ready with %s running containers.\n' "$(date)" "$count" >> "$LOG"
    wait "$mount_pid"
    exit 0
  fi
  sleep 2
done

printf '[%s] ERROR: Party Games Docker did not become ready.\n' "$(date)" >> "$LOG"
wait "$mount_pid"
exit 1
