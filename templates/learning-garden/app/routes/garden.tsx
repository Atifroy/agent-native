import { useT } from "@agent-native/core/client/i18n";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";

import { ColorShapeGame } from "@/components/garden/ColorShapeGame";
import { CountingGame } from "@/components/garden/CountingGame";
import { GardenHub } from "@/components/garden/GardenHub";
import { LetterSoundGame } from "@/components/garden/LetterSoundGame";
import { useGardenProgress } from "@/hooks/use-garden";
import { APP_TITLE } from "@/lib/app-config";

import type { GardenActivity } from "../../server/garden/types.js";

export function meta() {
  return [{ title: APP_TITLE }];
}

export default function GardenRoute() {
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramActivity = searchParams.get("activity") as GardenActivity | null;
  const [activity, setActivity] = useState<GardenActivity | null>(
    paramActivity,
  );
  const { data } = useGardenProgress();

  const openActivity = useCallback(
    (next: GardenActivity) => {
      setActivity(next);
      setSearchParams({ activity: next }, { replace: true });
    },
    [setSearchParams],
  );

  const goHome = useCallback(() => {
    setActivity(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const difficultyFor = (id: GardenActivity) =>
    data?.activities.find((entry) => entry.activity === id)?.difficulty ?? {};

  if (!activity) {
    return (
      <>
        <span className="sr-only">{t("garden.pageTitle")}</span>
        <GardenHub onSelect={openActivity} />
      </>
    );
  }

  if (activity === "letter-sound") {
    const d = difficultyFor("letter-sound") as { choiceCount?: number };
    return <LetterSoundGame onBack={goHome} choiceCount={d.choiceCount} />;
  }

  if (activity === "counting") {
    const d = difficultyFor("counting") as {
      minCount?: number;
      maxCount?: number;
      choiceCount?: number;
    };
    return (
      <CountingGame
        onBack={goHome}
        minCount={d.minCount}
        maxCount={d.maxCount}
        choiceCount={d.choiceCount}
      />
    );
  }

  const d = difficultyFor("color-shape") as { choiceCount?: number };
  return <ColorShapeGame onBack={goHome} choiceCount={d.choiceCount} />;
}
