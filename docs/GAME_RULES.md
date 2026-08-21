# Canonical Game Rules

These rules are the product source of truth. A PR that changes game behavior should update this file.

## Rule Wheel

1. Players choose a rule pack.
2. A player spins the wheel.
3. The app selects one rule from the available pack.
4. The result becomes active for the current session.
5. Active rules remain visible and can be removed individually.
6. Reset clears the session after confirmation.
7. An already-active rule should not be selected again unless no unused rules remain.

Default rules must be family-friendly. Examples include speaking in an accent for one round, using a chosen nickname, or earning/losing a point after a trigger.

## Matching

1. Shuffle an even set of face-down cards.
2. A player reveals two cards.
3. Matching cards remain visible and count as a pair.
4. Non-matching cards turn face down after a short delay.
5. Continue until all pairs are found.

The first implementation may be single-player or pass-the-device and does not require accounts.

## Guess the Number

1. Choose a number range.
2. One player privately selects or receives a secret number.
3. Other players enter their guesses.
4. The closest guess wins the round.
5. Ties must be displayed clearly rather than resolved arbitrarily.
6. Rotate the secret-number role.

## Imposter

1. Enter 4–8 player names and choose a word pack.
2. Most players privately see the same secret word.
3. One player sees only a related hint and is the Imposter.
4. Pass the device so each player can explicitly reveal and hide their role in private.
5. Active players take turns giving exactly one spoken clue related to the secret word.
6. After discussion, the group votes in person and records one accused player in the app.
7. A tied group gives the tied players one additional clue and votes again. If the second vote is also tied, nobody is eliminated and all active players begin another clue round.
8. An accused regular player is eliminated, and the remaining players begin another clue round.
9. An accused Imposter gets one final guess at the secret word. A correct guess gives the Imposter the win; otherwise, the regular players win.
10. The Imposter also wins if only one regular player remains.

The app must remove the previous player's private role from view before showing the next handoff screen. Eliminated players may watch, but they no longer give clues, discuss, or vote.

See [`IMPOSTER_GAME_PLAN.md`](IMPOSTER_GAME_PLAN.md) for the research, rationale, implementation plan, and playtest questions behind these rules.
