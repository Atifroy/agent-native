import { now, table, text } from "@agent-native/core/db/schema";
import { integer, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * One row per (owner, activity). Tracks lifetime attempt counts, the current
 * correct-answer streak, and the best streak ever reached, plus the
 * difficulty knobs used to generate the next round. Kept as a single small
 * row per activity rather than a per-attempt log: the child's parent/agent
 * only ever needs "how is she doing", never a raw event history.
 */
export const gardenActivityState = table(
  "garden_activity_state",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    activity: text("activity").notNull(),
    attempts: integer("attempts").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    streak: integer("streak").notNull().default(0),
    bestStreak: integer("best_streak").notNull().default(0),
    difficultyJson: text("difficulty_json").notNull().default("{}"),
    lastPlayedAt: text("last_played_at"),
    createdAt: text("created_at").notNull().default(now()),
    updatedAt: text("updated_at").notNull().default(now()),
  },
  (t) => ({
    uniqueOwnerActivity: uniqueIndex(
      "idx_garden_activity_state_unique_owner_activity",
    ).on(t.ownerEmail, t.activity),
  }),
);

export type StoredGardenActivityState = typeof gardenActivityState.$inferSelect;
export type NewGardenActivityState = typeof gardenActivityState.$inferInsert;
