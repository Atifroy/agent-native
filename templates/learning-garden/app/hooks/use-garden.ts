import {
  useActionMutation,
  useActionQuery,
} from "@agent-native/core/client/hooks";

import type { GardenActivity } from "../../server/garden/types.js";

export interface GardenActivityState {
  activity: GardenActivity;
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  difficulty: Record<string, number | undefined>;
  lastPlayedAt: string | null;
}

export function useGardenProgress() {
  return useActionQuery("get-progress", {}) as {
    data: { activities: GardenActivityState[] } | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useRecordAttempt() {
  return useActionMutation("record-attempt");
}
