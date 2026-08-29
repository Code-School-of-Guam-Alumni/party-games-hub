#!/bin/bash
set -Eeuo pipefail

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin

SERVICE_DIR=${PARTY_GAMES_SERVICE_DIR:-/Users/jerry/services/party-games-hub}
COMPOSE_FILE="$SERVICE_DIR/compose.production.yml"
ENV_FILE="$SERVICE_DIR/.env.production"
STATE_FILE="$SERVICE_DIR/.deployed-sha"
LOCK_DIR="$SERVICE_DIR/.deploy.lock"
WORKFLOW_API="https://api.github.com/repos/Code-School-of-Guam-Alumni/party-games-hub/actions/workflows/publish-images.yml/runs?branch=main&status=success&per_page=1"
DOCKER_BIN=${DOCKER_BIN:-docker}

cd "$SERVICE_DIR"

acquire_lock() {
  if mkdir "$LOCK_DIR" 2>/dev/null; then
    printf '%s\n' "$$" > "$LOCK_DIR/pid"
    return 0
  fi

  lock_pid=""
  if [[ -f "$LOCK_DIR/pid" ]]; then
    lock_pid=$(tr -d '[:space:]' < "$LOCK_DIR/pid")
  fi

  if [[ "$lock_pid" =~ ^[0-9]+$ ]] && kill -0 "$lock_pid" 2>/dev/null; then
    echo "Another Party Games deployment is already running."
    return 1
  fi

  rm -f "$LOCK_DIR/pid"
  rmdir "$LOCK_DIR" 2>/dev/null || return 1
  mkdir "$LOCK_DIR"
  printf '%s\n' "$$" > "$LOCK_DIR/pid"
}

if ! acquire_lock; then
  exit 0
fi
trap 'rm -f "$LOCK_DIR/pid"; rmdir "$LOCK_DIR"' EXIT

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

latest_sha=${DEPLOY_SHA:-}
if [[ -z "$latest_sha" ]]; then
  latest_sha=$(
    curl --fail --silent --show-error --max-time 20 \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "$WORKFLOW_API" |
      /usr/bin/python3 -c 'import json,sys; runs=json.load(sys.stdin).get("workflow_runs", []); print(runs[0]["head_sha"] if runs else "")'
  )
fi

if [[ ! "$latest_sha" =~ ^[0-9a-f]{40}$ ]]; then
  echo "No valid successful production image SHA is available." >&2
  exit 1
fi

current_sha=""
if [[ -f "$STATE_FILE" ]]; then
  current_sha=$(tr -d '[:space:]' < "$STATE_FILE")
fi

if [[ "$latest_sha" == "$current_sha" ]] && [[ "${FORCE_DEPLOY:-0}" != "1" ]]; then
  if "$SERVICE_DIR/ops/mac-mini/healthcheck.sh" >/dev/null 2>&1; then
    echo "Party Games is already running $latest_sha."
    exit 0
  fi
  echo "Party Games records $latest_sha but is not healthy; reconciling the release."
fi

if [[ "${SKIP_REPOSITORY_SYNC:-0}" != "1" ]]; then
  if [[ ! -d "$SERVICE_DIR/.git" ]]; then
    echo "$SERVICE_DIR must be a Git clone so deployment files can track the released commit." >&2
    exit 1
  fi

  if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
    echo "Tracked deployment files have local changes; refusing to overwrite them." >&2
    exit 1
  fi

  git fetch --quiet origin main
  git cat-file -e "$latest_sha^{commit}"
  git checkout --quiet --detach "$latest_sha"
fi

export IMAGE_TAG="sha-$latest_sha"

echo "Pulling Party Games images for $latest_sha..."
"$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull api web

if [[ "$latest_sha" != "$current_sha" ]] && \
   "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --status running db --quiet | grep -q .; then
  "$SERVICE_DIR/ops/mac-mini/backup.sh" predeploy
fi

echo "Preparing the database..."
"$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d db
"$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm api ./bin/rails db:prepare db:seed

echo "Starting Party Games $latest_sha..."
"$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans api web

wait_for_health() {
  local attempts=$1
  local interval=$2

  for _ in $(seq 1 "$attempts"); do
    if curl --fail --silent --max-time 5 "http://127.0.0.1:${PARTY_GAMES_PORT:-8787}/healthz" >/dev/null && \
       curl --fail --silent --max-time 5 "http://127.0.0.1:${PARTY_GAMES_PORT:-8787}/up" >/dev/null && \
       curl --fail --silent --max-time 5 "http://127.0.0.1:${PARTY_GAMES_PORT:-8787}/api/v1/games" >/dev/null; then
      return 0
    fi
    sleep "$interval"
  done

  return 1
}

if ! wait_for_health "${DEPLOY_HEALTH_ATTEMPTS:-30}" "${DEPLOY_HEALTH_INTERVAL:-4}"; then
  echo "Party Games failed its health checks." >&2
  "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps >&2 || true
  "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail 100 api web >&2 || true

  if [[ "$current_sha" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Rolling back to $current_sha..." >&2
    if [[ "${SKIP_REPOSITORY_SYNC:-0}" != "1" ]]; then
      git checkout --quiet --detach "$current_sha"
    fi
    export IMAGE_TAG="sha-$current_sha"
    "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans api web
    if ! wait_for_health "${ROLLBACK_HEALTH_ATTEMPTS:-30}" "${ROLLBACK_HEALTH_INTERVAL:-4}"; then
      echo "Rollback to $current_sha also failed its health checks." >&2
      "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail 100 api web >&2 || true
    fi
  else
    "$DOCKER_BIN" compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" stop api web || true
  fi
  exit 1
fi

printf '%s\n' "$latest_sha" > "$STATE_FILE.tmp"
mv "$STATE_FILE.tmp" "$STATE_FILE"
chmod 600 "$STATE_FILE"

echo "Party Games deployed successfully at $latest_sha."
