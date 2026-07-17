# Contributing

## Branches

`main` must stay runnable. Do not commit directly to it.

Use short-lived task branches:

```text
feat/ron-rule-wheel
feat/kiko-active-rules
feat/lanna-game-library
fix/ron-wheel-animation
chore/leon-ci-setup
```

A person owns a workstream, not one permanent branch. Start every task from the latest `main`:

```bash
git switch main
git pull --ff-only
git switch -c feat/your-name-short-task
```

## Commits

Prefer small, descriptive commits:

```text
feat: add rule wheel selection logic
fix: prevent duplicate active rules
 test: cover closest-number tie
 docs: clarify WSL PostgreSQL setup
```

## Pull requests

Every PR must:

- Link its GitHub issue.
- Describe what changed and why.
- State exactly how it was tested.
- Disclose how Pi/AI was used.
- Include screenshots for visible UI changes.
- Stay small enough for another team member to understand.
- Receive at least one human approval before merge.

Leon is the default final merger during the first milestone. Lanna may review product copy, rules, and UX; Ron and Kiko should review each other's implementation where practical.

## Definition of done

A task is done only when:

- Acceptance criteria are met.
- Tests/lint/build pass.
- The contributor can explain the code.
- The PR is reviewed and merged.
- The issue is closed.
- The branch is deleted.

## Pi usage

Good Pi requests are bounded:

> Read issue #4 and `AGENTS.md`. Explain your plan, then help me implement only the wheel-selection utility and its tests.

Bad Pi requests hide the learning:

> Build the whole app and push it.

If Pi writes code you cannot explain, do not open the PR yet.
