import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createInMemoryGardenDb } from "../db/test-garden-table.js";
import {
  getActivityState,
  listActivityStates,
  recordAttempt,
  setDifficulty,
} from "./store.js";

type TestDb = Awaited<ReturnType<typeof createInMemoryGardenDb>>;

let client: TestDb["client"];
let testDb: TestDb["testDb"];

beforeEach(async () => {
  ({ client, testDb } = await createInMemoryGardenDb());
});

afterEach(() => {
  client.close();
});

const OWNER = "parent@example.com";

describe("listActivityStates", () => {
  it("defaults every activity for an owner who has never played", async () => {
    const states = await listActivityStates({ ownerEmail: OWNER }, testDb);
    expect(states.map((s) => s.activity)).toEqual([
      "letter-sound",
      "counting",
      "color-shape",
    ]);
    expect(states.every((s) => s.attempts === 0)).toBe(true);
  });
});

describe("recordAttempt", () => {
  it("increments the streak on correct answers and resets it on wrong ones", async () => {
    await recordAttempt(
      { ownerEmail: OWNER, activity: "counting", correct: true },
      testDb,
    );
    await recordAttempt(
      { ownerEmail: OWNER, activity: "counting", correct: true },
      testDb,
    );
    const afterTwo = await recordAttempt(
      { ownerEmail: OWNER, activity: "counting", correct: false },
      testDb,
    );

    expect(afterTwo.attempts).toBe(3);
    expect(afterTwo.correct).toBe(2);
    expect(afterTwo.streak).toBe(0);
    expect(afterTwo.bestStreak).toBe(2);
  });

  it("keeps activities independent per owner", async () => {
    await recordAttempt(
      { ownerEmail: OWNER, activity: "counting", correct: true },
      testDb,
    );
    const letterSound = await getActivityState(
      { ownerEmail: OWNER, activity: "letter-sound" },
      testDb,
    );
    expect(letterSound.attempts).toBe(0);
  });
});

describe("setDifficulty", () => {
  it("merge-patches the difficulty without touching progress counters", async () => {
    await recordAttempt(
      { ownerEmail: OWNER, activity: "counting", correct: true },
      testDb,
    );
    const updated = await setDifficulty(
      { ownerEmail: OWNER, activity: "counting", patch: { maxCount: 10 } },
      testDb,
    );

    expect(updated.difficulty).toMatchObject({ maxCount: 10, minCount: 2 });
    expect(updated.attempts).toBe(1);
  });
});
