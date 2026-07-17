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

1. Choose a word set and player count.
2. Most players privately see the same secret word.
3. One player sees only a related hint and is the imposter.
4. Pass the device so each player can reveal and hide their role privately.
5. Players take turns giving one related clue.
6. Players vote for the suspected imposter.
7. If the imposter is not found, play another clue round.

The app must prevent the next player from seeing the previous player's private role during handoff.
