import { ensureAdditiveColumns, getDbExec } from "@agent-native/core/db";

import { runGardenMigrations } from "../db/migrations.js";
import * as schema from "../db/schema.js";

export { runGardenMigrations };

function isDrizzleTable(value: unknown): value is object {
  return (
    !!value &&
    typeof value === "object" &&
    Object.getOwnPropertySymbols(value).some((s) =>
      s.toString().includes("drizzle"),
    )
  );
}

const schemaTables = Object.values(schema).filter(isDrizzleTable);

export default async (nitroApp: any): Promise<void> => {
  // Framework migration runner; bounded/idempotent and required before serving.
  // guard:allow-boot-data-work — one small table's migration ledger.
  await runGardenMigrations(nitroApp);
  try {
    // Standard framework additive-columns probe: one small table, bounded and idempotent.
    // guard:allow-boot-data-work — same pattern every template's db plugin runs at boot.
    const summary = await ensureAdditiveColumns({
      db: getDbExec(),
      tables: schemaTables,
    });
    if (summary.errors.length > 0) {
      console.warn(
        "[db] ensureAdditiveColumns completed with errors:",
        summary.errors,
      );
    }
  } catch (err) {
    console.warn(
      "[db] ensureAdditiveColumns failed (non-fatal):",
      err instanceof Error ? err.message : err,
    );
  }
};
