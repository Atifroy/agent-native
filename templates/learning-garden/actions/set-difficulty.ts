import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { setDifficulty, requireUserEmail } from "../server/garden/store.js";
import { GARDEN_ACTIVITIES } from "../server/garden/types.js";

export default defineAction({
  description:
    "Adjust the difficulty knobs for one Learning Garden mini-game, such as the number range for counting or how many answer choices to show. Provide only the fields to change; unset fields keep their current value. Use small, gradual adjustments — this game is meant to stay calm and predictable for the child.",
  schema: z.object({
    activity: z.enum(GARDEN_ACTIVITIES).describe("Which mini-game to tune"),
    choiceCount: z
      .number()
      .int()
      .min(2)
      .max(4)
      .optional()
      .describe("How many answer choices to show (2-4)"),
    minCount: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Counting only: smallest number of animals shown"),
    maxCount: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Counting only: largest number of animals shown"),
  }),
  run: async (args, ctx) => {
    const ownerEmail = requireUserEmail(ctx?.userEmail);
    const { activity, ...rest } = args;
    const patch: Record<string, unknown> = {};
    if (rest.choiceCount !== undefined) patch.choiceCount = rest.choiceCount;
    if (activity === "counting") {
      if (rest.minCount !== undefined) patch.minCount = rest.minCount;
      if (rest.maxCount !== undefined) patch.maxCount = rest.maxCount;
    }
    return setDifficulty({ ownerEmail, activity, patch });
  },
});
