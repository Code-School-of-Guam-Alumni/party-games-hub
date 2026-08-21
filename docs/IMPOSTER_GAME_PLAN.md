# Imposter Game Plan

This document explains what Leon's Imposter game is, why its MVP rules work the way they do, and how the four planned PRs should build it. The canonical behavior remains in [`GAME_RULES.md`](GAME_RULES.md); this file provides the implementation rationale and future roadmap.

## Product fit

Imposter is a short, in-person social deduction game for one shared phone. Most players know the same secret word. One randomly selected Imposter sees only a related hint and must blend in while everyone gives clues and tries to identify them.

It fits Party Games Hub because it:

- needs only one phone or laptop;
- works without accounts, rooms, or real-time networking;
- creates most of its fun through face-to-face conversation;
- can use family-friendly content in classrooms and mixed-age groups; and
- gives the project meaningful React state and Rails-backed content without exceeding MVP scope.

## Research summary

Several established games use this basic structure:

- **The Chameleon** gives one player no secret word. Everyone gives a one-word clue, discusses, and votes. A caught Chameleon gets one final opportunity to guess the word.
- **Undercover** gives regular players one word and an undercover player a similar word. Its no-word "Mr. White" role must improvise and can win by guessing the regular players' word when caught.
- Browser-based Imposter games commonly use one shared phone, private role reveals, one-word clues, short discussion, and voting for groups of roughly 3–8 players.

Useful sources:

- [Big Potato Games — The Chameleon](https://bigpotato.com/products/the-chameleon)
- [Undercover — official game rules](https://www.yanstarstudio.com/undercover-how-to-play)
- [Undercover — tie and pass-and-play FAQ](https://www.yanstarstudio.com/undercover-faq)
- [Imposter.app — beginner rules](https://imposter.app/how-to-play-imposter-game/)
- [Imposter Games — pass-the-phone guide](https://impostergames.org/how-to)

Party Games Hub should use the familiar structure without copying another game's branding, interface, wording, or proprietary word lists.

## MVP decisions

### Players

- Support 4–8 named players.
- Assign exactly one Imposter.
- Keep multiple Imposters and special roles out of the MVP.

Names make handoffs and results clear: "Pass the phone to Lanna" is safer and friendlier than "Player 3."

### Secret content

Each round uses one curated pair:

- **Secret word:** shown to every regular player.
- **Related hint:** shown only to the Imposter.

A hint should provide a direction without becoming a ready-made perfect clue.

| Secret word | Useful hint | Why it works |
|---|---|---|
| Pizza | Often shared | Related, but does not reveal the answer |
| Bicycle | Human-powered travel | Gives the Imposter a plausible direction |
| Umbrella | Used when weather changes | Broad enough to require bluffing |
| Coconut | Tropical | Accessible and family-friendly |

Hints such as "cheese" for Pizza or "rain" for Umbrella are too revealing. A completely unrelated hint makes bluffing arbitrary rather than skillful.

### Clues

- Clues are spoken aloud; the app does not collect them.
- Every active player gives exactly one word per clue round.
- A clue cannot be the answer, a variation, spelling information, a rhyme, or a translation.
- The app identifies the starting player and rotates that role on replay when practical.

Regular players must prove they know the word without making it obvious. The Imposter must use the hint and previous clues to blend in.

### Discussion and voting

After all clues, players discuss in person. For the MVP, the group votes by pointing or agreeing aloud, and one person records the accused player in the app.

This follows the fast physical flow used by comparable games and avoids a second private pass-the-phone sequence for every ballot. Private in-app voting can be reconsidered after playtesting, but it is not required for a complete MVP.

If the group is tied:

1. Each tied player gives one additional clue.
2. The group votes again between those players.
3. If the second vote produces a single accused player, the app records that player.
4. If the second vote is also tied, nobody is eliminated and all active players begin another clue round.

The app should not randomly eliminate someone because deduction—not chance—should decide the result. A no-elimination round also prevents one player from becoming an arbitrary tie-breaker.

### Elimination and additional rounds

- If the accused player is regular, reveal that result and eliminate them.
- Eliminated players may watch but no longer give clues, discuss, or vote.
- Remaining players begin another clue round.
- If only one regular player and the Imposter remain, the Imposter wins because the regular player can no longer form a winning vote.

Elimination gives the documented "another clue round" behavior meaningful progression and prevents repeatedly accusing the same innocent player.

### Catching the Imposter

A caught Imposter receives one final guess at the secret word:

- Correct guess: the Imposter steals the win.
- Incorrect guess: the regular players win.

This established mechanic rewards the Imposter for interpreting clues and discourages regular players from giving away the answer. The first in-person playtest should confirm that the related hints do not make the final guess too easy.

### Session and scoring

The MVP ends each round with a clear winner and supports:

- play again with the same players;
- start over with new players; and
- return to the game library.

Persistent scoring, accounts, and leaderboards are out of scope.

## Round flow

```text
Setup players and word pack
        ↓
Load Rails-backed word content
        ↓
Choose a word and assign one Imposter
        ↓
Private handoff → reveal → hide for each player
        ↓
Clue round and in-person discussion
        ↓
Group vote; app records accused player
        ↓
Regular accused? → eliminate → next clue round
        ↓
Imposter accused? → final word guess
        ↓
Round result → play again or reset
```

## Privacy requirements

Private reveal is the most important interaction in this game.

For every player:

1. Show a neutral handoff screen naming only the next player.
2. Require that player to confirm they have the device.
3. Render the private role only after an explicit reveal action.
4. Require an explicit hide action.
5. Remove the role and secret content before naming the next player.

Implementation guardrails:

- Do not merely cover secret content with opacity or another card; remove it from the rendered page when hidden.
- Do not include the hidden word or hint in an accessible label before reveal.
- Do not create a browser-history entry for each reveal.
- Do not let Back navigation recover a previous player's role.
- Do not flash private content during transitions.
- Confirm before resetting an active round.

## Rails responsibility for PR 2

Rails owns reusable word content. A small data model is enough:

```text
ImposterWordPack
- name
- slug
- description
- active

ImposterWord
- imposter_word_pack_id
- word
- hint
```

A pack has many words, and each word belongs to one pack. The API can return active packs with their word-and-hint entries. React may select an entry locally because the active round is intentionally temporary client state.

Start with two original, family-friendly packs containing approximately 12–20 entries each. Do not copy another game's word database.

## React responsibility for PR 3

React owns the temporary round state. Model the game with explicit phases rather than many unrelated booleans:

```text
setup
loading
reveal-handoff
role-reveal
clues
voting
vote-result
final-guess
round-result
```

Important logic should be kept in small pure functions, such as:

- assigning exactly one Imposter;
- choosing a word entry;
- moving to the next active player;
- eliminating an accused player;
- deciding whether the Imposter reached the final two;
- checking the final guess without case or surrounding-space differences; and
- resetting all private round state.

This separation will make the code easier for students to test and explain.

## Testing priorities

### Rails

- Packs and words validate required fields.
- Words belong to the expected pack.
- The endpoint returns the documented JSON shape.
- Inactive content is excluded if the `active` field is introduced.
- Seed data is idempotent and family-friendly.

### React and game logic

- Exactly one Imposter is assigned.
- Regular players receive the word; the Imposter receives only the hint.
- Secret content is absent before reveal and after hide.
- Eliminated players do not receive future turns.
- Catching the Imposter leads to the final guess.
- A correct or incorrect final guess produces the right winner.
- The Imposter wins when only one regular player remains.
- Reset removes all role, word, vote, and result state.

## Four-PR implementation plan

### PR 1 — Skeleton

Branch: `leon-imposter-skeleton`

- Dedicated game page and styles
- Concise instructions
- Setup, reveal, clue, vote, and result preview sections
- Placeholder controls only
- Mobile-first layout
- No random role assignment or playable loop

### PR 2 — Rails content API

Branch: `leon-imposter-api`

- Word-pack and word models
- Migrations and schema
- Original seed content
- Versioned API endpoint
- Rails tests

### PR 3 — Playable loop

Branch: `leon-imposter-gameplay`

- Fetch word packs
- Setup and role assignment
- Privacy-safe reveal loop
- Clue rounds, group-vote recording, and elimination
- Final guess, winner, replay, reset, and error states
- Tests for game logic and private rendering

If that becomes too large for one understandable PR, split it only after updating the assignment plan with the team.

### PR 4 — Polish and playtest

Branch: `leon-imposter-polish`

- Physical-phone privacy test
- Keyboard and screen-reader review
- At least 44px touch targets
- Clear loading and disabled states
- Reset confirmation and edge cases
- Optional discussion timer if playtesting shows it is needed
- Avoid immediate word or Imposter repetition where practical

Implementation note: automated rules, desktop Chrome, and a 375px responsive
viewport are covered in the stack. A real group and physical-phone privacy test
remain human sign-off items; they are not replaced by browser emulation.

## Playtest questions

The first real group test should answer:

1. Are related hints too easy or too difficult?
2. Does four-player mode feel balanced, or should the minimum group be larger?
3. Does a final guess make the Imposter too strong?
4. How long should discussion last before the game drags?
5. Is public group voting comfortable, or do players want private ballots?
6. Can every handoff happen without exposing the prior role?

Use those findings for PR 4 rather than adding settings before they are proven necessary.

## Explicitly deferred

Do not add the following during the MVP:

- accounts or persistent profiles;
- room codes, WebSockets, or remote multiplayer;
- multiple Imposters or special roles;
- public user-generated word packs;
- persistent scoring or leaderboards;
- AI-generated live content; or
- server-side round sessions.
