import { useCallback, useRef, useState } from "react";

import type { GardenActivity } from "../../server/garden/types.js";
import { useRecordAttempt } from "./use-garden";

const MILESTONE_EVERY = 5;
const FEEDBACK_MS = 900;

/**
 * Shared round lifecycle for all three mini-games: generate a round, accept
 * one tap, show brief calm feedback, record the attempt, and either advance
 * (correct) or silently re-arm the same choices (wrong) — never a timer,
 * never a score, never a penalty. `generateRound` must be a pure function of
 * nothing but the current difficulty, so calling it again after a correct
 * answer is always safe.
 */
export function useRoundEngine<Round>(
  activity: GardenActivity,
  generateRound: () => Round,
) {
  const [round, setRound] = useState<Round>(() => generateRound());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [locked, setLocked] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);
  const recordAttempt = useRecordAttempt();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submit = useCallback(
    (correct: boolean) => {
      if (locked) return;
      setLocked(true);
      setFeedback(correct ? "correct" : "wrong");

      recordAttempt.mutate(
        { activity, correct },
        {
          onSuccess: (data: unknown) => {
            const streak = (data as { streak?: number } | undefined)?.streak;
            if (
              correct &&
              typeof streak === "number" &&
              streak > 0 &&
              streak % MILESTONE_EVERY === 0
            ) {
              setMilestone(streak);
            }
          },
        },
      );

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => {
          setFeedback(null);
          setLocked(false);
          setMilestone(null);
          if (correct) setRound(generateRound());
        },
        correct ? FEEDBACK_MS + 400 : FEEDBACK_MS,
      );
    },
    [activity, generateRound, locked, recordAttempt],
  );

  return { round, feedback, locked, milestone, submit };
}
