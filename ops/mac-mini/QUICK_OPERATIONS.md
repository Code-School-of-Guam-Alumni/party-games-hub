# Party Games production: quick operations

## What is running

- Public app: <https://party-games.shimizu-technology.com>
- Host: Shimizu Technology Mac mini
- Service directory: `/Users/jerry/services/party-games-hub`
- Runtime: dedicated Colima profile named `party-games`
- Local port: `127.0.0.1:8787`
- Database backups: `/Volumes/T9/Backups/party-games-hub/postgres`

The Party Games VM has 2 CPUs, 2 GiB of memory, a 20 GiB disk, no host
directory mounts, and no automatic Colima port forwarder. Its containers have
their own CPU, memory, PID, and log limits. A supervised SSH tunnel publishes
only the guest's reverse-proxy port to the same port on Mac mini loopback;
Cloudflare Tunnel is the public entry point.

## How deployment works

1. A pull request is reviewed and merged into `main`.
2. GitHub Actions runs the API, web, and deployment checks.
3. After those checks pass, GitHub builds immutable ARM64 API and web images.
4. The images are published to public GHCR packages using the merge commit SHA.
5. The Mac mini checks the latest successful release every three minutes.
6. For a changed SHA, it backs up PostgreSQL once, prepares the database,
   starts the new containers, runs health checks, and records the SHA only
   after the release is healthy. Reconciliation of an unhealthy current SHA
   does not create another backup.
7. If health checks fail, the deploy script returns to the previous image SHA.

The mini is pull-only. It is not a GitHub Actions runner and stores no GitHub
token. Do not make the mini build student branches or unreviewed pull requests.

## Normal checks

From any computer:

```bash
curl --fail https://party-games.shimizu-technology.com/healthz
curl --fail https://party-games.shimizu-technology.com/up
```

On the Mac mini:

```bash
cd /Users/jerry/services/party-games-hub
./ops/mac-mini/healthcheck.sh
cat .deployed-sha
tail -n 50 /Users/jerry/Library/Logs/party-games-deploy.log
```

To inspect the dedicated runtime directly:

```bash
export DOCKER_HOST=unix:///Users/jerry/.colima/party-games/docker.sock
colima status --profile party-games
docker compose --env-file .env.production -f compose.production.yml ps
docker stats --no-stream
```

## After a Mac mini reboot

Party Games and its Cloudflare Tunnel start before anyone logs in. During the
August 22, 2026 rollout, the public app recovered in about 25 seconds across
two unattended reboots.

Other Mac mini services currently behave differently:

| Service | Before Jerry login? | Current reason |
|---|---:|---|
| Party Games | Yes | Dedicated system LaunchDaemons and mount-free Colima profile |
| Håfa Code | Yes | Native system LaunchDaemons |
| Immich | No | Its current Colima profile uses a T9 host mount and a login LaunchAgent |
| OpenClaw/Jerry | No | OpenClaw ships a per-user LaunchAgent on macOS |
| Syncthing | No | Homebrew installed it as a per-user LaunchAgent |
| Tailscale | No | The Mac App Store variant runs as the logged-in user |

Logging into the `jerry` account restores the login-dependent services. Do not
enable automatic login or store the account password in a script.

## Backups

Create and verify a backup:

```bash
cd /Users/jerry/services/party-games-hub
./ops/mac-mini/backup.sh manual
gzip -t "$(ls -1t /Volumes/T9/Backups/party-games-hub/postgres/*.dump.gz | head -n 1)"
```

The backup script refuses to write if T9 is not mounted. This prevents an
apparently successful backup from being written into an empty `/Volumes/T9`
directory on the internal disk.

## Manual release recovery

Reconcile the latest successful release:

```bash
cd /Users/jerry/services/party-games-hub
./ops/mac-mini/deploy.sh
```

Deploy a specific successful SHA:

```bash
DEPLOY_SHA=<full-40-character-sha> ./ops/mac-mini/deploy.sh
```

Do not edit the production checkout, manually retag images, delete the
PostgreSQL volume, expose Docker ports to the LAN, or install a self-hosted
GitHub runner on this mini.

## Current host follow-up

The durable plan for making Immich, OpenClaw, Syncthing, and Tailscale
available before login is tracked in the Mac mini server inventory. Treat that
as separate host work: it must not weaken Party Games isolation or give student
code access to Jerry, Immich, T9, or the Docker socket.
