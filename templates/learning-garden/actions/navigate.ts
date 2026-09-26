/**
 * Navigate the UI to a view.
 *
 * Usage:
 *   pnpm action navigate --view=garden
 *   pnpm action navigate --view=garden --activity=counting
 */

import { defineAction } from "@agent-native/core/action";
import { writeAppStateForCurrentTab } from "@agent-native/core/application-state";
import { z } from "zod";

import { GARDEN_ACTIVITIES } from "../server/garden/types.js";
import {
  NAV_VIEW_INPUTS,
  pathForView,
  resolveNavView,
} from "../shared/navigation.js";

const viewSchema = z.enum(NAV_VIEW_INPUTS);

export const navigateSchema = z.object({
  view: viewSchema.describe(
    "View name to navigate to; home and ask are aliases for garden",
  ),
  activity: z
    .enum(GARDEN_ACTIVITIES)
    .optional()
    .describe("Mini-game to open on /garden"),
});

export default defineAction({
  description:
    "Navigate the Rayya's Learning Garden UI to a view, optionally opening one of the three mini-games.",
  schema: navigateSchema,
  http: false,
  run: async (args) => {
    const view = resolveNavView(args.view);
    const nav: Record<string, string> = { view };
    if (args.activity) nav.activity = args.activity;
    nav._writeId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await writeAppStateForCurrentTab("navigate", nav);
    return `Navigating to ${pathForView(view)}`;
  },
});
