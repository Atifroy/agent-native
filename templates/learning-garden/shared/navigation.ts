/** Agent-facing view names for navigate + view-screen parity. */
import type { GardenActivity } from "../server/garden/types.js";

export const NAV_VIEWS = ["garden", "settings", "team"] as const;

export type NavView = (typeof NAV_VIEWS)[number];

export const VIEW_ROUTES: Record<NavView, string> = {
  garden: "/garden",
  settings: "/settings",
  team: "/team",
};

const NAV_VIEW_ALIAS_NAMES = ["home", "ask"] as const;

export type NavViewAlias = (typeof NAV_VIEW_ALIAS_NAMES)[number];

export const NAV_VIEW_ALIASES: Record<string, NavView> = {
  home: "garden",
  ask: "garden",
};

export const NAV_VIEW_INPUTS = [...NAV_VIEWS, ...NAV_VIEW_ALIAS_NAMES] as const;

export type NavViewInput = (typeof NAV_VIEW_INPUTS)[number];

export function resolveNavView(view: NavViewInput): NavView {
  return view in NAV_VIEW_ALIASES
    ? NAV_VIEW_ALIASES[view as NavViewAlias]
    : (view as NavView);
}

export interface NavigationState {
  view: NavView;
  path?: string;
  activity?: GardenActivity;
}

export interface NavigateCommand {
  view?: NavView;
  activity?: GardenActivity;
}

export function viewForPath(pathname: string): NavView {
  for (const view of NAV_VIEWS) {
    if (pathname.startsWith(VIEW_ROUTES[view])) return view;
  }
  return "garden";
}

export function pathForView(view?: NavView): string {
  if (view && view in VIEW_ROUTES) return VIEW_ROUTES[view];
  return VIEW_ROUTES.garden;
}
