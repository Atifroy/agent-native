import { useT } from "@agent-native/core/client/i18n";
import { useCallback } from "react";

import { pickOne, shuffled } from "@/lib/random";

import { useRoundEngine } from "../../hooks/use-round-engine";
import { ActivityShell } from "./ActivityShell";
import { ChoiceButton } from "./ChoiceButton";
import {
  COLOR_IDS,
  SHAPE_IDS,
  ShapeIcon,
  type ColorId,
  type ShapeId,
} from "./shapes";

interface Card {
  shape: ShapeId;
  color: ColorId;
}

function cardKey(card: Card): string {
  return `${card.shape}-${card.color}`;
}

interface ColorShapeRound {
  target: Card;
  choices: Card[];
}

function makeRound(choiceCount: number): ColorShapeRound {
  const target: Card = { shape: pickOne(SHAPE_IDS), color: pickOne(COLOR_IDS) };
  const seen = new Set([cardKey(target)]);
  const distractors: Card[] = [];
  while (distractors.length < choiceCount - 1) {
    const candidate: Card = {
      shape: pickOne(SHAPE_IDS),
      color: pickOne(COLOR_IDS),
    };
    const key = cardKey(candidate);
    if (!seen.has(key)) {
      seen.add(key);
      distractors.push(candidate);
    }
  }
  return { target, choices: shuffled([target, ...distractors]) };
}

export function ColorShapeGame({
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
    "color-shape",
    generateRound,
  );

  return (
    <ActivityShell
      onBack={onBack}
      prompt={
        <span className="inline-flex items-center gap-3">
          <ShapeIcon
            shape={round.target.shape}
            color={round.target.color}
            className="size-12"
          />
          {t("garden.findTheMatch")}
        </span>
      }
      feedback={feedback}
      milestone={milestone}
    >
      {round.choices.map((card) => {
        const isThisCorrect = cardKey(card) === cardKey(round.target);
        return (
          <ChoiceButton
            key={cardKey(card)}
            disabled={locked}
            state={feedback && isThisCorrect ? "correct" : "idle"}
            ariaLabel={`${t(`colors.${card.color}`)} ${t(`shapes.${card.shape}`)}`}
            onClick={() => submit(isThisCorrect)}
          >
            <ShapeIcon
              shape={card.shape}
              color={card.color}
              className="size-16"
            />
          </ChoiceButton>
        );
      })}
    </ActivityShell>
  );
}
