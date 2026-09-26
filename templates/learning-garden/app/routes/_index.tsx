import { appPath } from "@agent-native/core/client/api-path";
import { MarketingHome } from "@agent-native/toolkit/marketing";

import { APP_TITLE } from "@/lib/app-config";

const SEO_TITLE = APP_TITLE + " - a calm learning game for one child";
const SEO_DESCRIPTION =
  "A calm, farm-animal-themed learning game with letter-sound, counting, and color/shape mini-games, built for one autistic child's pace, with an agent that can track her progress alongside her.";

export function meta() {
  return [
    { title: SEO_TITLE },
    { name: "description", content: SEO_DESCRIPTION },
    { property: "og:title", content: SEO_TITLE },
    { property: "og:description", content: SEO_DESCRIPTION },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: SEO_TITLE },
    { name: "twitter:description", content: SEO_DESCRIPTION },
  ];
}

export default function MarketingHomeRoute() {
  return (
    <MarketingHome
      appName={APP_TITLE}
      tagline="A calm, farm-animal learning game for one child, built to hold her attention at her own pace."
      description={SEO_DESCRIPTION}
      valueProps={[
        "Three predictable mini-games: letters and sounds, counting, and colors and shapes",
        "Large tap targets, no timers, no scores, and no punishing failure states",
        "An agent that can tell you how she's doing today and gently adjust difficulty",
      ]}
      primaryActionHref={appPath("/home")}
      secondaryActionHref={appPath("/sign-in")}
    />
  );
}
