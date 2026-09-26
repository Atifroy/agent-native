import { and, eq } from "drizzle-orm";

import { getDb } from "../db/index.js";
import { gardenActivityState } from "../db/schema.js";
import type { DbHandle } from "../db/transaction.js";
import { AuthError, UserInputError } from "../errors.js";
import {
  DEFAULT_DIFFICULTY,
  GARDEN_ACTIVITIES,
  type GardenActivity,
  type GardenActivityState,
  type GardenDifficulty,
} from "./types.js";

export function requireUserEmail(email: string | undefined): string {
  if (!email) {
    throw new AuthError("Authentication required.");
  }
  return email;
}

function parseDifficultyJson<A extends GardenActivity>(
  activity: A,
  json: string,
): GardenDifficulty[A] {
  try {
    const parsed = JSON.parse(json);
    return { ...DEFAULT_DIFFICULTY[activity], ...parsed };
  } catch {
    // A truncated or corrupted row falls back to the documented default
    // rather than crashing the whole progress read for one bad activity.
    return DEFAULT_DIFFICULTY[activity];
  }
}

function toState(
  row: typeof gardenActivityState.$inferSelect,
): GardenActivityState {
  const activity = row.activity as GardenActivity;
  return {
    activity,
    attempts: row.attempts,
    correct: row.correct,
    streak: row.streak,
    bestStreak: row.bestStreak,
    difficulty: parseDifficultyJson(activity, row.difficultyJson),
    lastPlayedAt: row.lastPlayedAt ?? null,
  };
}

function emptyState(activity: GardenActivity): GardenActivityState {
  return {
    activity,
    attempts: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    difficulty: DEFAULT_DIFFICULTY[activity],
    lastPlayedAt: null,
  };
}

/** All three activities, each defaulted when the owner has never played it. */
export async function listActivityStates(
  input: { ownerEmail: string },
  db: DbHandle = getDb(),
): Promise<GardenActivityState[]> {
  const rows = await db
    .select()
    .from(gardenActivityState)
    .where(eq(gardenActivityState.ownerEmail, input.ownerEmail));
  const byActivity = new Map(rows.map((row) => [row.activity, row]));
  return GARDEN_ACTIVITIES.map((activity) => {
    const row = byActivity.get(activity);
    return row ? toState(row) : emptyState(activity);
  });
}

export async function getActivityState(
  input: { ownerEmail: string; activity: GardenActivity },
  db: DbHandle = getDb(),
): Promise<GardenActivityState> {
  const [row] = await db
    .select()
    .from(gardenActivityState)
    .where(
      and(
        eq(gardenActivityState.ownerEmail, input.ownerEmail),
        eq(gardenActivityState.activity, input.activity),
      ),
    )
    .limit(1);
  return row ? toState(row) : emptyState(input.activity);
}

/**
 * Record one round's outcome. `correct: true` increments the streak (and
 * best streak); `correct: false` resets the streak to zero without
 * decrementing anything else — a wrong tap in this game is never a penalty,
 * only "not yet a streak point" (see product spec: no punishing failure
 * states).
 */
export async function recordAttempt(
  input: {
    ownerEmail: string;
    activity: GardenActivity;
    correct: boolean;
    now?: string;
  },
  db: DbHandle = getDb(),
): Promise<GardenActivityState> {
  const now = input.now ?? new Date().toISOString();
  const existing = await getActivityState(
    { ownerEmail: input.ownerEmail, activity: input.activity },
    db,
  );

  const attempts = existing.attempts + 1;
  const correct = existing.correct + (input.correct ? 1 : 0);
  const streak = input.correct ? existing.streak + 1 : 0;
  const bestStreak = Math.max(existing.bestStreak, streak);

  await upsertState(
    {
      ownerEmail: input.ownerEmail,
      activity: input.activity,
      attempts,
      correct,
      streak,
      bestStreak,
      difficultyJson: JSON.stringify(existing.difficulty),
      lastPlayedAt: now,
      now,
    },
    db,
  );

  return {
    activity: input.activity,
    attempts,
    correct,
    streak,
    bestStreak,
    difficulty: existing.difficulty,
    lastPlayedAt: now,
  };
}

/** Merge-patch the difficulty knobs for one activity (e.g. widen the number range). */
export async function setDifficulty(
  input: {
    ownerEmail: string;
    activity: GardenActivity;
    patch: Record<string, unknown>;
    now?: string;
  },
  db: DbHandle = getDb(),
): Promise<GardenActivityState> {
  if (Object.keys(input.patch).length === 0) {
    throw new UserInputError("Provide at least one difficulty field to set.");
  }
  const now = input.now ?? new Date().toISOString();
  const existing = await getActivityState(
    { ownerEmail: input.ownerEmail, activity: input.activity },
    db,
  );
  const difficulty = { ...existing.difficulty, ...input.patch };

  await upsertState(
    {
      ownerEmail: input.ownerEmail,
      activity: input.activity,
      attempts: existing.attempts,
      correct: existing.correct,
      streak: existing.streak,
      bestStreak: existing.bestStreak,
      difficultyJson: JSON.stringify(difficulty),
      lastPlayedAt: existing.lastPlayedAt,
      now,
    },
    db,
  );

  return { ...existing, difficulty };
}

async function upsertState(
  input: {
    ownerEmail: string;
    activity: GardenActivity;
    attempts: number;
    correct: number;
    streak: number;
    bestStreak: number;
    difficultyJson: string;
    lastPlayedAt: string | null;
    now: string;
  },
  db: DbHandle,
): Promise<void> {
  await db
    .insert(gardenActivityState)
    .values({
      id: `${input.ownerEmail}:${input.activity}`,
      ownerEmail: input.ownerEmail,
      activity: input.activity,
      attempts: input.attempts,
      correct: input.correct,
      streak: input.streak,
      bestStreak: input.bestStreak,
      difficultyJson: input.difficultyJson,
      lastPlayedAt: input.lastPlayedAt ?? undefined,
      createdAt: input.now,
      updatedAt: input.now,
    })
    .onConflictDoUpdate({
      target: [gardenActivityState.ownerEmail, gardenActivityState.activity],
      set: {
        attempts: input.attempts,
        correct: input.correct,
        streak: input.streak,
        bestStreak: input.bestStreak,
        difficultyJson: input.difficultyJson,
        lastPlayedAt: input.lastPlayedAt ?? undefined,
        updatedAt: input.now,
      },
    });
}
