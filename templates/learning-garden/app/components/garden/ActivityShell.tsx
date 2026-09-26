import { useT } from "@agent-native/core/client/i18n";
import { IconArrowLeft } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

import { RoundFeedback } from "./RoundFeedback";
import { StreakSparkle } from "./StreakSparkle";

/**
 * Shared full-screen frame every mini-game renders inside: a quiet back
 * button, the round's prompt, the answer grid (children), and the
 * feedback/milestone overlays. Keeping this in one place is what makes the
 * three games look and behave identically — the repetition is the point.
 */
export function ActivityShell({
  onBack,
  prompt,
  feedback,
  milestone,
  children,
}: {
  onBack: () => void;
  prompt: React.ReactNode;
  feedback: "correct" | "wrong" | null;
  milestone: number | null;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center gap-8 bg-[hsl(var(--garden-sky)/0.35)] px-4 py-8">
      {milestone !== null && <StreakSparkle streak={milestone} />}
      <div className="flex w-full max-w-2xl items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1 text-muted-foreground"
        >
          <IconArrowLeft className="size-4" />
          {t("garden.back")}
        </Button>
      </div>

      <p className="text-center text-2xl font-medium text-foreground">
        {prompt}
      </p>

      <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {children}
        </div>
      </div>

      <div className="flex h-12 items-center">
        {feedback && <RoundFeedback state={feedback} />}
      </div>
    </div>
  );
}
