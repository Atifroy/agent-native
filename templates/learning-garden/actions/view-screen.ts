/**
 * See what the user is currently looking at on screen.
 *
 * Usage:
 *   pnpm action view-screen
 */

import { defineAction } from "@agent-native/core/action";
import { readAppStateForCurrentTab } from "@agent-native/core/application-state";
import { z } from "zod";

import {
  listActivityStates,
  requireUserEmail,
} from "../server/garden/store.js";
import { GARDEN_ACTIVITIES } from "../server/garden/types.js";

const navigationStateSchema = z.object({
  view: z.string(),
  path: z.string().optional(),
  activity: z.enum(GARDEN_ACTIVITIES).optional(),
});

export default defineAction({
  description:
    "Inspect the current Learning Garden screen: which view is open, which mini-game (if any) is active, and progress for all three activities.",
  schema: z.object({}),
  http: false,
  readOnly: true,
  run: async (_args, ctx) => {
    const raw = await readAppStateForCurrentTab("navigation");
    const parsed = navigationStateSchema.safeParse(raw);
    const navigation = parsed.success ? parsed.data : undefined;

    const ownerEmail = requireUserEmail(ctx?.userEmail);
    const activities = await listActivityStates({ ownerEmail });

    const screen: Record<string, unknown> = { activities };
    if (navigation) screen.navigation = navigation;

    return screen;
  },
});
