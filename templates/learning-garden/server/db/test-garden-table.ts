import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { PGlite } = createRequire(
  new URL("../../../../packages/core/package.json", import.meta.url),
)("@electric-sql/pglite");
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "./schema.js";

export const TEST_GARDEN_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS garden_activity_state (
  id TEXT PRIMARY KEY,
  owner_email TEXT NOT NULL,
  activity TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  difficulty_json TEXT NOT NULL DEFAULT '{}',
  last_played_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_garden_activity_state_unique_owner_activity
  ON garden_activity_state (owner_email, activity);
`;

export async function createInMemoryGardenDb() {
  const dir = mkdtempSync(join(tmpdir(), "garden-test-"));
  const client = await PGlite.create(dir);
  for (const statement of TEST_GARDEN_TABLE_SQL.split(";")
    .map((sql) => sql.trim())
    .filter(Boolean)) {
    await client.query(statement);
  }
  const testDb = drizzle(client, { schema });

  const close = client.close.bind(client);
  client.close = async () => {
    await close();
    rmSync(dir, { recursive: true, force: true });
  };

  return { client, testDb };
}
