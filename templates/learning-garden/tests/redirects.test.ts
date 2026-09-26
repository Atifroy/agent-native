import { describe, expect, it } from "vitest";

import { loader } from "../app/routes/home";

describe("Learning Garden private home route", () => {
  it("marks the redirect as cacheable HTML", () => {
    const response = loader();

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/garden");
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );
  });
});
