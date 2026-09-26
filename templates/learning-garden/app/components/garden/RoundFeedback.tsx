import { useT } from "@agent-native/core/client/i18n";
import { IconCheck } from "@tabler/icons-react";

/**
 * Calm, brief feedback banner. Correct = soft glow + checkmark + affirming
 * word. Wrong = a gentle "try again", never a red X or a buzzer — the round
 * simply resets with the same choices.
 */
export function RoundFeedback({ state }: { state: "correct" | "wrong" }) {
  const t = useT();
  if (state === "correct") {
    return (
      <div
        role="status"
        className="flex items-center gap-2 rounded-full bg-[hsl(var(--garden-glow)/0.3)] px-5 py-2 text-lg font-medium text-foreground"
      >
        <IconCheck className="size-5" />
        {t("garden.yes")}
      </div>
    );
  }
  return (
    <div
      role="status"
      className="rounded-full bg-muted px-5 py-2 text-lg font-medium text-muted-foreground"
    >
      {t("garden.tryAgain")}
    </div>
  );
}
