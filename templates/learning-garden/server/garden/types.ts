/**
 * The three mini-games. Kept as a closed, hand-written set (not a free-form
 * string) because the agent's difficulty knobs and the UI's round generator
 * both branch on this value — a typo here must be a type error, not a
 * silently-ignored fourth activity nobody renders.
 */
export const GARDEN_ACTIVITIES = [
  "letter-sound",
  "counting",
  "color-shape",
] as const;

export type GardenActivity = (typeof GARDEN_ACTIVITIES)[number];

export function isGardenActivity(value: string): value is GardenActivity {
  return (GARDEN_ACTIVITIES as readonly string[]).includes(value);
}

/** Difficulty knobs per activity. All optional — unset means "use the default". */
export interface LetterSoundDifficulty {
  choiceCount?: number; // how many animal picture choices (2-4)
}

export interface CountingDifficulty {
  minCount?: number;
  maxCount?: number; // upper bound on how many animals appear
  choiceCount?: number; // how many number choices (2-3)
}

export interface ColorShapeDifficulty {
  choiceCount?: number; // how many cards (2-4)
}

export type GardenDifficulty = {
  "letter-sound": LetterSoundDifficulty;
  counting: CountingDifficulty;
  "color-shape": ColorShapeDifficulty;
};

export const DEFAULT_DIFFICULTY: GardenDifficulty = {
  "letter-sound": { choiceCount: 3 },
  counting: { minCount: 2, maxCount: 5, choiceCount: 3 },
  "color-shape": { choiceCount: 3 },
};

export interface GardenActivityState {
  activity: GardenActivity;
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  difficulty: GardenDifficulty[GardenActivity];
  lastPlayedAt: string | null;
}
