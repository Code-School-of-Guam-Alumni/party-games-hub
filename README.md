# Party Games Hub

A mobile-first web collection of pass-the-device party games built by the Code School of Guam alumni internship team.

**Status:** Project foundation plus a stacked, playable Imposter reference implementation

## Team

- Leon
- Lanna
- Ron
- Kiko

## Product direction

The MVP is a responsive web app that works well on phones and laptops. Players share or pass a device. The default content is family-friendly and does not require alcohol.

Planned games and owners:

1. **Rule Wheel** — Kiko
2. **Matching** — Ron
3. **Guess the Number** — Lanna
4. **Imposter** — Leon

See [`docs/GAME_ASSIGNMENTS.md`](docs/GAME_ASSIGNMENTS.md), [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md), and [`docs/GAME_RULES.md`](docs/GAME_RULES.md).

Leon's four-branch Imposter build is documented as a teaching example in
[`docs/STACKED_PR_DEMO.md`](docs/STACKED_PR_DEMO.md). The other games remain at
their assigned milestones.

## Stack

```text
api/   Rails 8.1 API + PostgreSQL
web/   React 19 + Vite + TypeScript
docs/  Product, workflow, game, and setup documentation
```

Phase 1 deliberately excludes authentication, payments, real-time multiplayer, room codes, and app-store submission.

## Quick start

Windows contributors should complete [`docs/WINDOWS_WSL_SETUP.md`](docs/WINDOWS_WSL_SETUP.md) first.

### API

```bash
cd api
bundle install
bin/rails db:prepare
bin/rails server -p 3000
```

Verify:

- `http://localhost:3000/up`
- `http://localhost:3000/api/v1/games`

### Web

In a second WSL terminal:

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`.

## How we work

1. Review your next step in `docs/GAME_ASSIGNMENTS.md`.
2. Run `git checkout main` and `git pull origin main`.
3. Create a task branch with `git checkout -b branch-name`.
4. Use Pi to help with the task, but read and understand every change.
5. Run the relevant tests and build.
6. Open a small pull request using the repository template.
7. Get at least one human review before merging.
8. Delete the branch after merge.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md) before making changes.

## Communication

WhatsApp is used for coordination and questions. `docs/GAME_ASSIGNMENTS.md` defines the work split, while branches and pull requests show active and completed code work. The team is not using GitHub Issues yet.

## Production

The public deployment runs on the Shimizu Technology Mac mini at
`https://party-games.shimizu-technology.com`. Merges to `main` deploy
automatically after the existing API, frontend, and deployment checks pass.
GitHub-hosted Actions publish immutable ARM64 images; the mini pulls only the
exact commit from the latest successful publish workflow.

The production Compose stack, deployment scripts, backup procedure, launchd
services, and recovery steps are documented in
[`ops/mac-mini/README.md`](ops/mac-mini/README.md). For the short operational
version, use
[`ops/mac-mini/QUICK_OPERATIONS.md`](ops/mac-mini/QUICK_OPERATIONS.md).

## AI rule

> AI can help you code, debug, and understand the project, but you own the code. You must read it, run it, test it, and explain your pull request.
