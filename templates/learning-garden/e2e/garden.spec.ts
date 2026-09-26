import { expect, test } from "@playwright/test";

test.describe("Rayya's Learning Garden", () => {
  test("shows the three mini-games and opens one", async ({ page }) => {
    await page.goto("/garden");

    await expect(
      page.getByRole("button", { name: "Letter & Sound" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Counting" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Colors & Shapes" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Counting" }).click();

    // The counting game replaces the hub with a back button and an answer grid.
    await expect(
      page.getByRole("button", { name: "Back to garden" }),
    ).toBeVisible();
    const choices = page.getByRole("button").filter({ hasText: /^\d$/ });
    await expect(choices).toHaveCount(3);
  });

  test("taps an answer and gets calm feedback either way", async ({ page }) => {
    await page.goto("/garden?activity=counting");

    const choices = page.getByRole("button").filter({ hasText: /^\d$/ });
    await expect(choices).toHaveCount(3);
    await choices.first().click();

    // Either "Yes!" (correct) or "Try again!" (incorrect) — both are calm,
    // neither is a red error state, and the same choices remain on screen.
    await expect(page.getByRole("status")).toBeVisible();
    await expect(choices).toHaveCount(3);
  });
});
