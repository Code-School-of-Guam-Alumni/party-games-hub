# Game Assignments

Each person owns one game from initial skeleton through a playable, polished version.

| Person | Game |
|---|---|
| Kiko | Rule Wheel |
| Ron | Matching |
| Lanna | Guess the Number |
| Leon | Imposter |

Game ownership does **not** mean one permanent branch. Each owner completes their game through a series of small branches and pull requests.

## Why we are splitting it this way

- Everyone has clear ownership.
- Each person can use Pi within a bounded part of the app.
- Most work stays inside that game's files.
- PRs remain small enough to review and explain.
- The team can make progress on different games without constantly editing the same code.

## Branch ownership rule

One person owns each task branch. Other people review the PR instead of adding unrelated commits to that branch.

Before each new branch:

```bash
git checkout main
git pull origin main
git checkout -b branch-name
```

The previous PR must be merged before that person starts the next step for the same game.

## Four-step game plan

Each person follows the same sequence. The exact details can change after the team reviews the prior PR.

### PR 1 — Skeleton

Create the game's basic structure without trying to finish everything:

- Game page/component
- Title and short instructions
- Main visual sections
- Placeholder controls
- Mobile-friendly starting layout
- No large gameplay implementation yet

Branches:

```text
kiko-rule-wheel-skeleton
ron-matching-skeleton
lanna-guess-number-skeleton
leon-imposter-skeleton
```

### PR 2 — Rails data/API

Add the smallest useful Rails-backed data for the game:

- **Rule Wheel:** rule packs and rules
- **Matching:** card sets or card-pack definitions
- **Guess the Number:** range/preset definitions and instructions
- **Imposter:** secret-word packs and related hints

Each API change needs Rails tests. Do not add authentication, accounts, real-time rooms, or unrelated models.

Branches:

```text
kiko-rule-wheel-api
ron-matching-api
lanna-guess-number-api
leon-imposter-api
```

### PR 3 — Playable game loop

Connect React to the required data and make one complete round playable:

- Handle the core interaction
- Show the result/winner/end state
- Support replay/reset
- Handle empty/error states
- Add tests for important game logic

Branches:

```text
kiko-rule-wheel-gameplay
ron-matching-gameplay
lanna-guess-number-gameplay
leon-imposter-gameplay
```

### PR 4 — Polish and playtest

Finish the first version:

- Phone-width layout
- Keyboard/accessibility review
- Clear instructions and feedback
- Loading/disabled states
- Edge-case fixes
- Screenshots in the PR
- In-person playtest

Branches:

```text
kiko-rule-wheel-polish
ron-matching-polish
lanna-guess-number-polish
leon-imposter-polish
```

## Avoiding conflicts

Each owner should keep game-specific React files under a dedicated folder:

```text
web/src/games/rule-wheel/
web/src/games/matching/
web/src/games/guess-the-number/
web/src/games/imposter/
```

Game-specific Rails controllers, models, tests, and seed data should be clearly named for that game.

Shared files such as `web/src/App.tsx`, `api/config/routes.rb`, shared styles, and global navigation may still overlap. Before editing a shared file:

1. Say so in WhatsApp.
2. Pull the latest `main`.
3. Keep the shared-file change small.
4. Merge that PR before another person makes a conflicting shared-file change.

## Communication and tracking

The team is **not using GitHub Issues yet**.

- Use this file for assignments and step order.
- Use WhatsApp for quick coordination and questions.
- Use branches and PRs to show active and completed work.
- Put technical discussion and review feedback in the PR when it affects the code.

## First team milestone

1. Everyone clones the repo and runs Rails and React in WSL.
2. Everyone confirms the page says **Rails API connected**.
3. Each person creates their own skeleton branch.
4. Each person opens one small skeleton PR.
5. The team reviews and merges those PRs one at a time.
6. Each owner then starts their API branch from the updated `main`.
