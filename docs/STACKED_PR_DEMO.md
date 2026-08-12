# Stacked PR reference: Leon's Imposter game

This stack is a teaching example of one feature moving from idea to finished MVP
through four reviewable pull requests. It is an intentional exception to the
usual team rule of merging one step before starting the next.

Live stack:

1. [PR #14 — skeleton](https://github.com/Code-School-of-Guam-Alumni/party-games-hub/pull/14)
2. [PR #19 — Rails API](https://github.com/Code-School-of-Guam-Alumni/party-games-hub/pull/19)
3. [PR #20 — playable loop](https://github.com/Code-School-of-Guam-Alumni/party-games-hub/pull/20)
4. [PR #21 — polish](https://github.com/Code-School-of-Guam-Alumni/party-games-hub/pull/21)

```text
main
└── leon-imposter-skeleton       PR 1: rules, plan, and visual skeleton
    └── leon-imposter-api        PR 2: Rails models, seeds, and endpoint
        └── leon-imposter-gameplay  PR 3: complete playable React loop
            └── leon-imposter-polish PR 4: accessibility and playtest polish
```

## How to review the stack

Review in order. On each PR, use the PR's base branch—not `main`—as the start of
the diff:

| Order | Branch | Base | Review focus |
|---|---|---|---|
| 1 | `leon-imposter-skeleton` | `main` | Product rules, scope, responsive structure |
| 2 | `leon-imposter-api` | `leon-imposter-skeleton` | Data model, API contract, seeds, Rails tests |
| 3 | `leon-imposter-gameplay` | `leon-imposter-api` | State flow, role privacy, voting, win rules |
| 4 | `leon-imposter-polish` | `leon-imposter-gameplay` | Recovery, accessibility, edge cases, evidence |

The parent branches are expected to appear in the child's history. The child PR
diff itself should contain only its next review focus.

## Safe merge order

1. Merge PR 1 and keep its branch temporarily.
2. Retarget PR 2 to `main`, confirm the diff still contains only API work, then merge it.
3. Retarget PR 3 to `main`, confirm its diff, then merge it.
4. Retarget PR 4 to `main`, run final checks, then merge it.
5. Delete the four feature branches only after their child PRs have been retargeted.

If a parent changes during review, rebase each child onto its updated parent and
use `git push --force-with-lease` only on the affected owned branches. Never use
plain `--force` on a shared branch.

## What this example demonstrates

- A product/rules decision can be reviewed before persistence or gameplay exists.
- The Rails contract can be reviewed independently from the React state machine.
- Pure game rules can be tested separately from hands-on phone-width playtesting.
- Each PR body can explain its dependency, verification, AI usage, and remaining
  human sign-off without pretending the entire feature arrived at once.

Draft status on PRs 2–4 is deliberate. Leon still needs to review and explain the
code, and the team still needs an in-person group/physical-phone playtest before
calling the MVP production-ready.
