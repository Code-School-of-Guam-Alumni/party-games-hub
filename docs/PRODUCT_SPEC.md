# Party Games Hub — MVP Product Spec

## Goal

Build a polished, mobile-first party game hub that gives four contributors real experience with Rails, React, GitHub issues, short-lived branches, pull requests, testing, review, and responsible use of Pi.

## Primary use case

A group opens the website on a phone or laptop and shares or passes the device while playing short in-person games. The first release does not require accounts or separate connected devices.

## MVP

### Application shell

- Mobile-first game library
- Clear game instructions
- Shared visual system and navigation
- Rails-provided game/rule catalog
- Helpful loading, empty, and error states

### Rule Wheel — first playable

- Select a family-friendly rule pack
- Spin the wheel
- Randomly select a rule
- Add the result to active rules
- View and remove active rules
- Reset the current session
- Prevent accidental duplicate active rules

### Round two

- Matching Game
- Guess the Number

### Team stretch

- Imposter pass-the-device flow

## Backend responsibility

Rails owns the source-of-truth catalog for games, rule packs, and rules. React owns temporary round interactions and presentation. PostgreSQL persistence should be introduced through a bounded issue after the initial static API contract is understood.

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
