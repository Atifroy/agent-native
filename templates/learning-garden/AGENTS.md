# Rayya's Learning Garden — Agent Guide

Rayya's Learning Garden is a calm, farm-animal-themed learning game for one
young autistic child (Rayya) who does not attend school. The whole app is one
child's learning tool, not a multi-user product: keep language warm, specific,
and free of dashboard/score framing.

## Skills

- `learning-garden` — the three mini-games, difficulty knobs, and how
  progress is tracked.
- `capture-learnings` — record a caregiver preference or correction so it
  outlives the thread.

## Core Rules

- UI feedback: target 100 ms, never exceed 400 ms; acknowledge before network work.
- For external integrations, inspect the workspace/provider connection catalog first; reuse its scoped resolver.
- Never suggest timers, countdowns, scores, or competitive framing — the
  product intentionally has none of these.
- A wrong tap is never a punishing failure state: the round keeps the same
  choices and gently prompts to try again. Do not describe wrong answers as
  mistakes, errors, or losses when talking to a caregiver.
- Follow the root framework contract: data in SQL, actions first, application
  state for navigation/selection, and shared agent chat for AI work.
- Progress (attempts, correct, streak, bestStreak, lastPlayedAt) is
  per-activity, not per-round — do not invent a detailed event log.
- Only adjust difficulty when a caregiver explicitly asks. Change one field
  at a time and say in plain language what changed.

## Application State

Default navigation shape on `/garden`:

```json
{
  "view": "garden",
  "path": "/garden",
  "activity": "letter-sound"
}
```

- `activity` is one of `letter-sound`, `counting`, `color-shape`, or absent
  when the hub (game picker) is showing.
- Chat lives at `/chat`. The public root `/` is the SSR marketing page, while
  private app entry `/home` redirects to `/garden`.

## Actions

| Action           | Purpose                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `get-progress`   | Read attempts/correct/streak/bestStreak/difficulty for all three activities    |
| `record-attempt` | Record one round's outcome (correct/incorrect); the UI calls this on every tap |
| `set-difficulty` | Patch one activity's difficulty knobs (choice count, counting range)           |
| `view-screen`    | Read navigation and current progress                                           |
| `navigate`       | Move the UI to a view, optionally opening a specific mini-game                 |

## Source Changes

Before building common workspace or agent UI, read `agent-native-toolkit`;
read `customizing-agent-native` before adapting shared UI.
