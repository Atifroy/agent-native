import { appPath } from "@agent-native/core/client/api-path";
import { useAgentRouteState } from "@agent-native/core/client/navigation";
import {
  type NavigateCommand,
  type NavigationState,
  pathForView,
  viewForPath,
} from "@shared/navigation";

import { TAB_ID } from "@/lib/tab-id";

export type { NavigateCommand, NavigationState };

export function useNavigationState() {
  useAgentRouteState<NavigationState, NavigateCommand & { _writeId?: string }>({
    browserTabId: TAB_ID,
    requestSource: TAB_ID,
    getNavigationState: ({ pathname, search }) => {
      const params = new URLSearchParams(search);
      return {
        view: viewForPath(pathname),
        path: appPath(pathname),
        activity: (params.get("activity") ?? undefined) as
          | NavigationState["activity"]
          | undefined,
      };
    },
    getCommandPath: (command) => {
      const base = pathForView(command.view);
      if (!command.activity) return base;
      return `${base}?activity=${encodeURIComponent(command.activity)}`;
    },
  });
}
