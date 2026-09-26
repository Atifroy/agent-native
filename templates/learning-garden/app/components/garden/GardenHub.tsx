import { useT } from "@agent-native/core/client/i18n";
import { IconAbc, IconPalette, Icon123 } from "@tabler/icons-react";

import { Card } from "@/components/ui/card";

import type { GardenActivity } from "../../../server/garden/types.js";

const ACTIVITY_META: Record<
  GardenActivity,
  { icon: typeof IconAbc; titleKey: string; hintKey: string }
> = {
  "letter-sound": {
    icon: IconAbc,
    titleKey: "garden.letterSoundTitle",
    hintKey: "garden.letterSoundHint",
  },
  counting: {
    icon: Icon123,
    titleKey: "garden.countingTitle",
    hintKey: "garden.countingHint",
  },
  "color-shape": {
    icon: IconPalette,
    titleKey: "garden.colorShapeTitle",
    hintKey: "garden.colorShapeHint",
  },
};

export function GardenHub({
  onSelect,
}: {
  onSelect: (activity: GardenActivity) => void;
}) {
  const t = useT();
  const order: GardenActivity[] = ["letter-sound", "counting", "color-shape"];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
      <p className="text-xl font-medium text-foreground">
        {t("garden.hubHeading")}
      </p>
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {order.map((activity) => {
          const meta = ACTIVITY_META[activity];
          const Icon = meta.icon;
          return (
            <Card key={activity} className="border-2 p-0">
              <button
                type="button"
                onClick={() => onSelect(activity)}
                className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl p-6 text-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-[hsl(var(--garden-sky)/0.7)]">
                  <Icon className="size-8 text-foreground" />
                </span>
                <span className="text-base font-medium text-foreground">
                  {t(meta.titleKey)}
                </span>
                <span className="sr-only">{t(meta.hintKey)}</span>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
