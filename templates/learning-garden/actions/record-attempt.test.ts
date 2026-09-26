import { beforeEach, describe, expect, it, vi } from "vitest";

const { recordAttempt } = vi.hoisted(() => ({
  recordAttempt: vi.fn(),
}));

vi.mock("../server/garden/store.js", () => ({
  recordAttempt,
  requireUserEmail: (email: string | undefined) => {
    if (!email) throw new Error("Authentication required.");
    return email;
  },
}));

import recordAttemptAction from "./record-attempt.js";

describe("record-attempt", () => {
  beforeEach(() => {
    recordAttempt.mockReset();
    recordAttempt.mockResolvedValue({
      activity: "counting",
      attempts: 4,
      correct: 3,
      streak: 2,
      bestStreak: 2,
      difficulty: { minCount: 2, maxCount: 5, choiceCount: 3 },
      lastPlayedAt: "2026-09-26T00:00:00.000Z",
    });
  });

  it("requires an authenticated caller", async () => {
    await expect(
      recordAttemptAction.run(
        { activity: "counting", correct: true },
        { userEmail: undefined, caller: "http" },
      ),
    ).rejects.toThrow("Authentication required.");
  });

  it("passes activity and correctness through to the store", async () => {
    await recordAttemptAction.run(
      { activity: "counting", correct: true },
      { userEmail: "parent@example.com", caller: "http" },
    );

    expect(recordAttempt).toHaveBeenCalledWith({
      ownerEmail: "parent@example.com",
      activity: "counting",
      correct: true,
    });
  });
});
