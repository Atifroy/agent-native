import { useT } from "@agent-native/core/client/i18n";
import { useCallback } from "react";

import { intBetween, pickOne, shuffled } from "@/lib/random";

import { useRoundEngine } from "../../hooks/use-round-engine";
import { ActivityShell } from "./ActivityShell";
import { ANIMALS, type AnimalDefinition } from "./animals";
import { ChoiceButton } from "./ChoiceButton";

interface CountingRound {
  animal: AnimalDefinition;
  count: number;
  choices: number[];
}

function makeRound(
  minCount: number,
  maxCount: number,
  choiceCount: number,
): CountingRound {
  const animal = pickOne(ANIMALS);
  const count = intBetween(minCount, maxCount);
  const distractors = new Set<number>();
  while (distractors.size < choiceCount - 1) {
    const candidate = intBetween(minCount, maxCount);
    if (candidate !== count) distractors.add(candidate);
  }
  return {
    animal,
    count,
    choices: shuffled([count, ...distractors]),
  };
}

export function CountingGame({
  onBack,
  minCount = 2,
  maxCount = 5,
  choiceCount = 3,
}: {
  onBack: () => void;
  minCount?: number;
  maxCount?: number;
  choiceCount?: number;
}) {
  const t = useT();
  const generateRound = useCallback(
    () => makeRound(minCount, maxCount, choiceCount),
    [minCount, maxCount, choiceCount],
  );
  const { round, feedback, locked, milestone, submit } = useRoundEngine(
    "counting",
    generateRound,
  );

  return (
    <ActivityShell
      onBack={onBack}
      prompt={t("garden.howManyAnimals")}
      feedback={feedback}
      milestone={milestone}
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {Array.from({ length: round.count }).map((_, index) => (
          <round.animal.Icon
            key={index}
            className="size-12"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        {round.choices.map((value) => (
          <ChoiceButton
            key={value}
            disabled={locked}
            state={feedback && value === round.count ? "correct" : "idle"}
            ariaLabel={String(value)}
            onClick={() => submit(value === round.count)}
          >
            <span className="text-4xl font-bold">{value}</span>
          </ChoiceButton>
        ))}
      </div>
    </ActivityShell>
  );
}
