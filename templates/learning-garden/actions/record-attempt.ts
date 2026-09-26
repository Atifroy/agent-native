import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { recordAttempt, requireUserEmail } from "../server/garden/store.js";
import { GARDEN_ACTIVITIES } from "../server/garden/types.js";

export default defineAction({
  description:
    "Record the outcome of one round of a Learning Garden mini-game (letter-sound, counting, or color-shape). Call this every time the child taps an answer, whether right or wrong, so streaks and progress stay accurate.",
  schema: z.object({
    activity: z
      .enum(GARDEN_ACTIVITIES)
      .describe("Which mini-game the round belonged to"),
    correct: z
      .boolean()
      .describe("Whether the tapped answer was the correct one"),
  }),
  run: async (args, ctx) => {
    const ownerEmail = requireUserEmail(ctx?.userEmail);
    return recordAttempt({
      ownerEmail,
      activity: args.activity,
      correct: args.correct,
    });
  },
});
