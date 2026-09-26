import { createAuthPlugin } from "@agent-native/core/server";

export default createAuthPlugin({
  workspaceAppPublicPaths: ["/"],
  marketing: {
    appName: "Rayya's Learning Garden",
    tagline:
      "A calm, farm-animal learning game for one child, built to hold her attention at her own pace.",
    features: [
      "Three predictable mini-games: letters and sounds, counting, and colors and shapes",
      "Large tap targets, no timers, no scores, and no punishing failure states",
      "An agent that can tell you how she's doing today and gently adjust difficulty",
    ],
  },
});
