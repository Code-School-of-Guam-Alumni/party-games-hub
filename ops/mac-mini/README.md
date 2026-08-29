# Mac mini production deployment

For routine health checks, reboot behavior, and recovery commands, start with
[`QUICK_OPERATIONS.md`](QUICK_OPERATIONS.md).

Party Games Hub is a public, low-volume classroom application. GitHub-hosted
Actions build immutable ARM64 images after CI passes on `main`. The Mac mini
polls the public workflow result, checks out the matching released commit,
pulls its exact successful images,
backs up PostgreSQL, applies migrations and seeds, starts the new containers,
and records the commit only after health checks pass.

## Runtime

- Service directory: `/Users/jerry/services/party-games-hub`
- Compose project: `party-games-hub`
- Local origin: `http://127.0.0.1:8787`
- Public origin: `https://party-games.shimizu-technology.com`
- Database backups: `/Volumes/T9/Backups/party-games-hub/postgres`
- Images: public GHCR packages tagged `sha-<full commit SHA>`
- Docker profile: `party-games` (2 CPUs, 2 GiB memory, 20 GiB disk)
- Docker socket: `/Users/jerry/.colima/party-games/docker.sock`

The app uses a dedicated Compose network and volume. Host ports bind only to
loopback. GitHub builds run on GitHub-hosted runners; the mini is not a
self-hosted Actions runner and does not store a GitHub token.

Party Games has a dedicated Colima profile with host-directory mounting and
automatic host-port forwarding disabled. A supervised, explicit SSH tunnel
publishes only the guest's `127.0.0.1:8787` origin back to the same Mac mini
loopback address. This avoids the event-driven forwarding failure that left
healthy containers unreachable after a restart, without exposing the app to
the LAN. This lets its system LaunchDaemon recover the app before console
login. Immich remains in its separate profile and starts from its
Homebrew LaunchAgent after Jerry logs in because that VM requires the external
T9 share. The Party Games VM never mounts T9; the host mounts T9 only for the
backup script.

## Required host file

Create `.env.production` from `env.production.example`, replace both secrets,
and set permissions to `0600`. Never commit that file.

## Manual deployment

```bash
cd /Users/jerry/services/party-games-hub
./ops/mac-mini/deploy.sh
./ops/mac-mini/healthcheck.sh
```

To deploy a specific successful image during recovery:

```bash
DEPLOY_SHA=<full-40-character-sha> ./ops/mac-mini/deploy.sh
```

## Backup and restore

Create a verified compressed backup:

```bash
./ops/mac-mini/backup.sh manual
```

Restore into a stopped application after selecting the exact backup:

```bash
docker compose --env-file .env.production -f compose.production.yml stop api web
gunzip -c /Volumes/T9/Backups/party-games-hub/postgres/<backup>.dump.gz |
  docker compose --env-file .env.production -f compose.production.yml exec -T db \
    pg_restore --clean --if-exists --no-owner --username party_games_hub \
      --dbname party_games_hub_production
```

Database migrations must remain backward-compatible with the immediately
previous application image. Runtime rollback cannot undo a destructive schema
migration.

## Launch services

`install-launchd.sh` installs boot-level services for the dedicated Party Games
Colima profile, explicit loopback forward, deployment polling, daily backups,
and the Cloudflare tunnel.
It leaves the default Colima login agent enabled for Immich. Validate the full
setup with an unattended reboot before treating the service as boot-resilient.

The Colima boot script retries the T9 host mount while starting Docker. The
backup script fails safely if T9 is absent instead of writing into an empty
`/Volumes/T9` directory on the internal disk.

## Verification

```bash
curl --fail http://127.0.0.1:8787/healthz
curl --fail http://127.0.0.1:8787/up
curl --fail http://127.0.0.1:8787/api/v1/games
curl --fail https://party-games.shimizu-technology.com/up
```

After a normal merge to `main`, confirm the `Publish production images`
workflow succeeds and `.deployed-sha` advances to that commit within five
minutes.
