import { useT } from "@agent-native/core/client/i18n";
import { IconSparkles } from "@tabler/icons-react";

/**
 * A calm milestone shown after a run of correct answers. No confetti, no
 * sound, no motion beyond a gentle fade/scale — see product spec: celebratory
 * but never overstimulating.
 */
export function StreakSparkle({ streak }: { streak: number }) {
  const t = useT();
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center"
    >
      <div className="garden-pop-in flex items-center gap-2 rounded-full bg-[hsl(var(--garden-glow)/0.35)] px-6 py-3 text-xl font-semibold text-foreground shadow-lg">
        <IconSparkles className="size-6" />
        {t("garden.streakMilestone", { count: streak })}
      </div>
    </div>
  );
}
