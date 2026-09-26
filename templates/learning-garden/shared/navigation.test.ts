import { describe, expect, it } from "vitest";

import {
  NAV_VIEW_INPUTS,
  NAV_VIEWS,
  pathForView,
  resolveNavView,
  viewForPath,
} from "./navigation.js";

describe("shared navigation", () => {
  it("maps paths to views", () => {
    expect(viewForPath("/garden")).toBe("garden");
    expect(viewForPath("/settings")).toBe("settings");
    expect(viewForPath("/")).toBe("garden");
  });

  it("maps views to paths and falls back to garden", () => {
    expect(pathForView("garden")).toBe("/garden");
    expect(pathForView("settings")).toBe("/settings");
    expect(pathForView(undefined)).toBe("/garden");
  });

  it("resolves aliases to canonical views", () => {
    expect(resolveNavView("home")).toBe("garden");
    expect(resolveNavView("ask")).toBe("garden");
    expect(resolveNavView("settings")).toBe("settings");
  });

  it("keeps aliases out of the pathname lookup", () => {
    // NAV_VIEWS drives viewForPath; an alias route here would shadow /garden.
    expect(viewForPath("/garden")).toBe("garden");
    expect(NAV_VIEW_INPUTS).toContain("home");
    expect(NAV_VIEWS).not.toContain("home" as never);
  });
});
