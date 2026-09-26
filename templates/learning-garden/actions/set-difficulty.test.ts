import { beforeEach, describe, expect, it, vi } from "vitest";

const { setDifficulty } = vi.hoisted(() => ({
  setDifficulty: vi.fn(),
}));

vi.mock("../server/garden/store.js", () => ({
  setDifficulty,
  requireUserEmail: (email: string | undefined) => {
    if (!email) throw new Error("Authentication required.");
    return email;
  },
}));

import setDifficultyAction from "./set-difficulty.js";

describe("set-difficulty", () => {
  beforeEach(() => {
    setDifficulty.mockReset();
    setDifficulty.mockResolvedValue({
      activity: "counting",
      attempts: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      difficulty: { minCount: 2, maxCount: 8, choiceCount: 3 },
      lastPlayedAt: null,
    });
  });

  it("only patches counting-only fields for counting", async () => {
    await setDifficultyAction.run(
      { activity: "counting", maxCount: 8 },
      { userEmail: "parent@example.com", caller: "http" },
    );

    expect(setDifficulty).toHaveBeenCalledWith({
      ownerEmail: "parent@example.com",
      activity: "counting",
      patch: { maxCount: 8 },
    });
  });

  it("ignores counting-only fields for other activities", async () => {
    await setDifficultyAction.run(
      { activity: "letter-sound", choiceCount: 4, minCount: 1 },
      { userEmail: "parent@example.com", caller: "http" },
    );

    expect(setDifficulty).toHaveBeenCalledWith({
      ownerEmail: "parent@example.com",
      activity: "letter-sound",
      patch: { choiceCount: 4 },
    });
  });
});
