# AGENTS.md

These instructions apply to Pi and any other coding agent working in this repository.

## Before editing

1. Read `README.md`.
2. Read `docs/PRODUCT_SPEC.md`.
3. Read `docs/GAME_ASSIGNMENTS.md`.
4. Identify the owner and task assigned to the current branch.
5. Run `git status` and confirm the branch is not `main`.

## Scope rules

- Work on one bounded task branch at a time.
- Do not add authentication, payments, real-time multiplayer, room codes, WebSockets, or native/mobile code unless Leon explicitly changes MVP scope.
- Do not add or upgrade dependencies without explaining why in the PR.
- Do not change both `api/` and `web/` unless the assigned PR step is explicitly a full-stack vertical slice.
- Keep default game content family-friendly. Do not make alcohol a required mechanic.
- Never commit `.env` files, credentials, tokens, Rails master keys, database dumps, or generated build artifacts.
- Stop and ask when requirements or file ownership are unclear.

## Required workflow

1. Explain the intended change before editing.
2. Make the smallest change that satisfies the assigned PR step.
3. Add or update tests for behavior changes.
4. Run the relevant verification commands.
5. Summarize changed files and test results for the student.
6. The student—not the agent—must review, understand, commit, and explain the work.

## Verification

API changes:

```bash
cd api
bin/rails test
bin/rubocop
bin/brakeman --no-pager
```

Web changes:

```bash
cd web
npm run lint
npm run build
```

Cross-stack changes must run both sets.

Deployment infrastructure changes must also run:

```bash
bash -n ops/mac-mini/*.sh
docker compose --env-file env.production.example -f compose.production.yml config --quiet
```

Production resources are intentionally persistent and belong to Leon after a
verified deployment. Do not stop the `party-games-hub` Compose project, its
Cloudflare tunnel, or its launchd services during routine development cleanup.
