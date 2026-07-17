# Party Games Hub — MVP Product Spec

## Goal

Build a polished, mobile-first party game hub that gives four contributors real experience with Rails, React, owned task branches, pull requests, testing, review, and responsible use of Pi.

## Primary use case

A group opens the website on a phone or laptop and shares or passes the device while playing short in-person games. The first release does not require accounts or separate connected devices.

## MVP

### Application shell

- Mobile-first game library
- Clear game instructions
- Shared visual system and navigation
- Rails-provided game/rule catalog
- Helpful loading, empty, and error states

### Rule Wheel — Kiko

- Select a family-friendly rule pack
- Spin the wheel
- Randomly select a rule
- Add the result to active rules
- View and remove active rules
- Reset the current session
- Prevent accidental duplicate active rules

### Matching — Ron

- Flip cards and find matching pairs
- Track matched cards and completion
- Replay/reset a finished game

### Guess the Number — Lanna

- Choose a number range
- Collect guesses
- Show the closest player or a tie
- Rotate the secret-number role

### Imposter — Leon

- Private pass-the-device role reveal
- Secret word and related hint
- Clue rounds and voting
- Replay/reset flow

## Backend responsibility

Rails owns source-of-truth game content such as rule packs, card packs, range presets, and secret-word packs. React owns temporary round interactions and presentation. Each owner introduces PostgreSQL-backed content through the API step documented in `docs/GAME_ASSIGNMENTS.md`.

## Explicitly out of scope for Phase 1

- Authentication and profiles
- Payments
- Real-time multiplayer
- Room codes
- Chat
- Native mobile applications
- App Store or Play Store submission
- Production admin dashboard
- User-generated public content
- Required alcohol mechanics

## Content policy

Default game content must be usable in a classroom, family gathering, or general social setting. Use terms such as challenge, point, penalty, dare, and house rule. Adult-only content is not part of the MVP.

## Success criteria

- A new contributor can complete WSL setup from the repository documentation.
- API and web apps run locally.
- The Rule Wheel is playable from start to reset.
- Each contributor merges meaningful work through a reviewed PR.
- The app is deployed and usable on a physical phone browser.
- Every contributor can explain their code and how Pi helped.
