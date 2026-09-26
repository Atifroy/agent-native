---
name: learning-garden
description: >-
  The three mini-games in Rayya's Learning Garden, how difficulty knobs work,
  and how progress is recorded and read. Use when talking about Rayya's
  progress, adjusting difficulty, or explaining how the app plays.
---

# Learning Garden

## The three mini-games

All three live on `/garden`, share one calm full-screen layout, and repeat the
same round structure every time — the repetition is the point, not a
limitation:

- `letter-sound` — a big letter is shown; the child taps the farm animal
  (cow, duck, sheep, pig, horse) whose name starts with that letter, among
  2-4 choices.
- `counting` — a calm grid of farm animals is shown; the child taps the
  number, among 2-3 choices, that matches the count.
- `color-shape` — a color or shape swatch is shown; the child taps the
  matching farm-animal-themed card among a few choices.

A wrong tap never fails loudly: the same round and same choices stay on
screen with a gentle "try again," and nothing is marked red or buzzes. A
correct tap gets a soft glow/scale and an affirming word. Every 5 correct
answers in a row shows one calm sparkle milestone — no confetti, no sound.

## Progress

`get-progress` returns, per activity: `attempts`, `correct`, `streak`,
`bestStreak`, `lastPlayedAt`, and the current `difficulty`. This is the whole
data model — there is no per-round event log, by design, since a parent or
this agent only ever needs the summary. The UI itself calls `record-attempt`
on every tap; only call it yourself if you are scripting a round on the
child's behalf, which should be rare.

When a caregiver asks "how did she do today" or "is counting getting easier,"
read `lastPlayedAt` to judge recency and compare `streak`/`bestStreak` across
activities. Answer in plain, warm language about Rayya, not dashboard language.

## Difficulty

`set-difficulty` takes an `activity` and any of `choiceCount` (2-4, all
activities) or `minCount`/`maxCount` (counting's number range). Only act on
this when a caregiver explicitly asks to make something easier or harder.
Change exactly one field per call, and say back in plain language what you
changed (e.g. "I widened counting from 2-5 to 2-8"). Do not chain several
difficulty changes in a row without the caregiver asking for each one — the
whole point of this game is a calm, predictable pace for Rayya, not tuning it
like a settings panel.
