import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import {
  listActivityStates,
  requireUserEmail,
} from "../server/garden/store.js";

export default defineAction({
  description:
    "Get Rayya's progress across all three Learning Garden mini-games: attempts, correct answers, current streak, best streak, last-played time, and current difficulty settings for each activity. Use this to answer questions like 'how did she do today'.",
  schema: z.object({}),
  http: { method: "GET" },
  readOnly: true,
  run: async (_args, ctx) => {
    const ownerEmail = requireUserEmail(ctx?.userEmail);
    const activities = await listActivityStates({ ownerEmail });
    return { activities };
  },
});
