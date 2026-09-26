import { useT } from "@agent-native/core/client/i18n";
import { useCallback, useMemo } from "react";

import { pickOne, shuffled } from "@/lib/random";

import { useRoundEngine } from "../../hooks/use-round-engine";
import { ActivityShell } from "./ActivityShell";
import { ANIMALS, type AnimalDefinition } from "./animals";
import { ChoiceButton } from "./ChoiceButton";

interface LetterSoundRound {
  target: AnimalDefinition;
  choices: AnimalDefinition[];
}

function makeRound(choiceCount: number): LetterSoundRound {
  const target = pickOne(ANIMALS);
  const others = shuffled(ANIMALS.filter((a) => a.id !== target.id)).slice(
    0,
    Math.max(1, choiceCount - 1),
  );
  return { target, choices: shuffled([target, ...others]) };
}

export function LetterSoundGame({
  onBack,
  choiceCount = 3,
}: {
  onBack: () => void;
  choiceCount?: number;
}) {
  const t = useT();
  const generateRound = useCallback(
    () => makeRound(choiceCount),
    [choiceCount],
  );
  const { round, feedback, locked, milestone, submit } = useRoundEngine(
    "letter-sound",
    generateRound,
  );

  const prompt = useMemo(
    () => t("garden.findTheAnimal", { letter: round.target.letter }),
    [round.target.letter, t],
  );

  return (
    <ActivityShell
      onBack={onBack}
      prompt={
        <span className="inline-flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-2xl bg-[hsl(var(--garden-sky))] text-3xl font-bold"
          >
            {round.target.letter}
          </span>
          {prompt}
        </span>
      }
      feedback={feedback}
      milestone={milestone}
    >
      {round.choices.map((animal) => {
        const isThisCorrect = animal.id === round.target.id;
        const state = feedback && isThisCorrect ? "correct" : "idle";
        return (
          <ChoiceButton
            key={animal.id}
            disabled={locked}
            state={state}
            ariaLabel={t(`animals.${animal.id}`)}
            onClick={() => submit(isThisCorrect)}
          >
            <animal.Icon className="size-16" />
          </ChoiceButton>
        );
      })}
    </ActivityShell>
  );
}
