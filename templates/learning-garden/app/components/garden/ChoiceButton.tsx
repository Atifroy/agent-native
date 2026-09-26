import { cn } from "@/lib/utils";

/**
 * Shared answer tile for all three mini-games. Minimum 64px tap target,
 * generous padding, and a state-driven ring/scale — never a red border or
 * shake on wrong answers (see product spec: no punishing failure states).
 */
export function ChoiceButton({
  onClick,
  state = "idle",
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  state?: "idle" | "correct" | "wrong";
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex min-h-24 min-w-24 flex-1 items-center justify-center rounded-3xl border-2 bg-card p-4 shadow-sm transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        state === "idle" &&
          "border-border hover:scale-[1.03] active:scale-[0.98]",
        state === "correct" &&
          "scale-105 border-[hsl(var(--garden-glow))] bg-[hsl(var(--garden-glow)/0.25)] shadow-md",
        state === "wrong" && "border-border opacity-70",
      )}
    >
      {children}
    </button>
  );
}
