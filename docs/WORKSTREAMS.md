# Team Workstreams

This file defines ownership and sequencing. GitHub Issues contain the final acceptance criteria and status.

## Ground rules

- No permanent personal branches.
- One short-lived branch per issue.
- `main` stays runnable.
- Each PR receives at least one human review.
- WhatsApp coordinates people; GitHub records the work.
- Owners may ask for help, pair, or review outside their lane.

## Foundation

### Leon — technical lead and integration

Responsibilities:

- Repository and monorepo foundation
- Shared API contracts and frontend conventions
- CI, branch protection, deployment, and environment documentation
- Issue scoping and dependency ordering
- Final integration and merge support
- Mentoring without silently completing everyone else's work

First milestone deliverables:

- Verify every contributor can run both apps in WSL
- Convert the starter game catalog into an agreed API contract
- Keep `main` green and deployable

## First playable: Rule Wheel

### Lanna — game library and product rules

Responsibilities:

- Game-library screen and navigation
- Canonical game instructions and family-friendly default copy
- Initial game/rule-pack data requirements
- UX review for Rule Wheel
- Co-lead the later Imposter flow

Suggested branch examples:

- `feat/lanna-game-library`
- `docs/lanna-rule-copy`

### Ron — wheel interaction

Responsibilities:

- Wheel presentation and spin control
- Random rule-selection utility
- Spin/loading/disabled states
- Tests for random selection and edge cases
- Later own Matching Game

Suggested branch examples:

- `feat/ron-rule-wheel`
- `test/ron-wheel-selection`

### Kiko — rule packs and active rules

Responsibilities:

- Rule-pack selector
- Active-rule list
- Add, remove, and reset behavior
- Duplicate prevention and local session persistence
- Later own Guess the Number

Suggested branch examples:

- `feat/kiko-active-rules`
- `feat/kiko-rule-packs`

## Round two

- **Ron:** Matching Game vertical slice
- **Kiko:** Guess the Number vertical slice
- **Lanna:** Imposter product flow and instructions
- **Leon:** integration, deployment, shared QA, and PR support

## Team stretch: Imposter

Imposter is intentionally deferred because hiding information and passing the device creates more complex state and privacy UX. Lanna leads product behavior, while the team divides implementation into bounded issues after Rule Wheel is playable.

## Dependency order

1. Everyone completes local setup and verifies both apps.
2. Leon lands shared API/frontend contracts.
3. Lanna, Ron, and Kiko work in separate files against those contracts.
4. Rule Wheel pieces merge in small PRs.
5. Team runs a phone-browser playtest.
6. Round-two games begin only after first-playable issues are closed.
