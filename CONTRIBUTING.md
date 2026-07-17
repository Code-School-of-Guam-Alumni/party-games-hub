# Contributing

Use the Code School of Guam guide as the main Git and pull-request workflow:

**[CSG Guide: Git and GitHub Pull Requests](https://github.com/Code-School-of-Guam-Alumni/Resources/blob/main/web-development/02-git-github/guide_git_and_github_pull_requests.md)**

This file adds only the project-specific rules for Party Games Hub.

## One owner, one task, one branch

Each game has one primary owner, but a game is built through multiple small task branches and pull requests. Do not keep one large game branch open for the whole project.

Only the branch owner should commit to that branch. Teammates can review, suggest changes, or pair with the owner without pushing unrelated work into the branch.

Examples:

```text
kiko-rule-wheel-skeleton
kiko-rule-wheel-api
kiko-rule-wheel-gameplay
ron-matching-skeleton
lanna-guess-number-skeleton
leon-imposter-skeleton
```

See [`docs/GAME_ASSIGNMENTS.md`](docs/GAME_ASSIGNMENTS.md) for ownership and the planned PR sequence.

## Start a task

Start from an updated `main`, following the commands students already use in the CSG guide:

```bash
git checkout main
git pull origin main
git checkout -b your-branch-name
```

To return to a branch that already exists locally:

```bash
git checkout your-branch-name
```

Confirm the branch before editing:

```bash
git branch --show-current
git status
```

Do not work directly on `main`.

## Save and push your work

Write code, check that it works, and commit in understandable chunks:

```bash
git status
git add --all
git commit -m "Add Rule Wheel page skeleton"
```

Before opening the pull request, bring in the latest team changes:

```bash
git pull origin main
```

Resolve any conflicts, test again, and then push your branch:

```bash
git push origin your-branch-name
```

Go to GitHub, click **Compare & pull request**, complete the PR template, and ask another team member for a review.

## Pull-request rules

Every PR must:

- Represent one clear task from `docs/GAME_ASSIGNMENTS.md`.
- Explain what changed and why.
- State exactly how the work was tested.
- Disclose how Pi/AI helped.
- Include screenshots for visible UI changes.
- Be understandable and demoable by the branch owner.
- Receive at least one human approval.
- Pass the required `api` and `web` checks.

Leon is the default final merger during the first milestone. Another teammate should still review and approve the work.

## After the PR is merged

Return to `main`, get the merged work, and delete the old local branch:

```bash
git checkout main
git pull origin main
git branch -D your-branch-name
```

Then create a **new branch from the updated `main`** for the next task. Do not continue new work on the branch that was already merged.

## Definition of done

A task is done when:

- The planned step in `docs/GAME_ASSIGNMENTS.md` is complete.
- The contributor can explain the code.
- Relevant tests, lint, and builds pass.
- The feature works locally.
- The PR is reviewed and merged.
- The branch is deleted after merge.

## Pi usage

A good Pi request is bounded to the current branch:

> Read `AGENTS.md` and my assigned step in `docs/GAME_ASSIGNMENTS.md`. I am on `kiko-rule-wheel-skeleton`. Explain the plan and help me build only the Rule Wheel skeleton for this PR.

A bad request hides the learning and creates an unreviewable change:

> Build my entire game and push it.

Pi can do a lot, but the branch owner must read, run, test, and explain everything in the PR.
