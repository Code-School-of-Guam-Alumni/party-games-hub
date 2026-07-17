# Party Games Hub

A mobile-first web collection of pass-the-device party games built by the Code School of Guam alumni internship team.

**Status:** Project foundation and first playable milestone

## Team

- **Leon** — technical lead, architecture, integration, review, and deployment
- **Lanna** — product/game rules, game-library experience, UX copy, and Imposter co-lead
- **Ron** — Rule Wheel first playable, then Matching
- **Kiko** — rule packs/active rules, then Guess the Number

Ownership is documented in [`docs/WORKSTREAMS.md`](docs/WORKSTREAMS.md). It defines lanes, not permanent personal branches.

## Product direction

The MVP is a responsive web app that works well on phones and laptops. Players share or pass a device. The default content is family-friendly and does not require alcohol.

Planned games:

1. **Rule Wheel** — first playable milestone
2. **Matching** — round two
3. **Guess the Number** — round two
4. **Imposter** — team stretch milestone

See [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) and [`docs/GAME_RULES.md`](docs/GAME_RULES.md).

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

1. Pick a bounded GitHub issue.
2. Update `main`.
3. Create a short-lived branch such as `feat/ron-rule-wheel`.
4. Use Pi to help with the issue, but read and understand every change.
5. Run the relevant tests and build.
6. Open a small pull request using the repository template.
7. Get at least one human review before merging.
8. Delete the branch after merge.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md) before making changes.

## Communication

WhatsApp is used for quick coordination and meeting reminders. GitHub Issues and pull requests are the source of truth for tasks, acceptance criteria, decisions, code discussion, and completion.

## AI rule

> AI can help you code, debug, and understand the project, but you own the code. You must read it, run it, test it, and explain your pull request.
