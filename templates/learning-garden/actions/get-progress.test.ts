import { beforeEach, describe, expect, it, vi } from "vitest";

const { listActivityStates } = vi.hoisted(() => ({
  listActivityStates: vi.fn(),
}));

vi.mock("../server/garden/store.js", () => ({
  listActivityStates,
  requireUserEmail: (email: string | undefined) => {
    if (!email) throw new Error("Authentication required.");
    return email;
  },
}));

import getProgressAction from "./get-progress.js";

describe("get-progress", () => {
  beforeEach(() => {
    listActivityStates.mockReset();
    listActivityStates.mockResolvedValue([
      {
        activity: "letter-sound",
        attempts: 0,
        correct: 0,
        streak: 0,
        bestStreak: 0,
        difficulty: { choiceCount: 3 },
        lastPlayedAt: null,
      },
    ]);
  });

  it("requires an authenticated caller", async () => {
    await expect(
      getProgressAction.run({}, { userEmail: undefined, caller: "http" }),
    ).rejects.toThrow("Authentication required.");
  });

  it("returns activities scoped to the caller", async () => {
    const result = await getProgressAction.run(
      {},
      { userEmail: "parent@example.com", caller: "http" },
    );

    expect(listActivityStates).toHaveBeenCalledWith({
      ownerEmail: "parent@example.com",
    });
    expect(result).toEqual({
      activities: [
        {
          activity: "letter-sound",
          attempts: 0,
          correct: 0,
          streak: 0,
          bestStreak: 0,
          difficulty: { choiceCount: 3 },
          lastPlayedAt: null,
        },
      ],
    });
  });
});
