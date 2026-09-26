import { runMigrations } from "@agent-native/core/db";
import { loadDrizzleMigrations } from "@agent-native/core/db/drizzle-migrations";

export const runGardenMigrations = runMigrations(
  async () =>
    await loadDrizzleMigrations(new URL("./migrations", import.meta.url)),
  { table: "learning_garden_migrations" },
);
