import { useActionMutation } from "@agent-native/core/client/hooks";
import { LanguagePicker, useT } from "@agent-native/core/client/i18n";
import {
  SettingsGroup,
  SettingsRow,
  SettingsTabsPage,
  useAgentSettingsTabs,
} from "@agent-native/core/client/settings";
import { useSetPageTitle } from "@agent-native/toolkit/app-shell";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGardenProgress } from "@/hooks/use-garden";
import { APP_TITLE } from "@/lib/app-config";

import type { GardenActivity } from "../../server/garden/types.js";

export function meta() {
  return [{ title: `Settings - ${APP_TITLE}` }];
}

const ACTIVITY_LABEL_KEY: Record<GardenActivity, string> = {
  "letter-sound": "garden.letterSoundTitle",
  counting: "garden.countingTitle",
  "color-shape": "garden.colorShapeTitle",
};

function DifficultyRow({ activity }: { activity: GardenActivity }) {
  const t = useT();
  const { data } = useGardenProgress();
  const setDifficulty = useActionMutation("set-difficulty");
  const state = data?.activities.find((entry) => entry.activity === activity);
  const choiceCount = (state?.difficulty as { choiceCount?: number })
    ?.choiceCount;

  return (
    <SettingsRow
      id={`difficulty-${activity}`}
      label={t(ACTIVITY_LABEL_KEY[activity])}
      control={
        <div className="w-40">
          <Select
            value={choiceCount ? String(choiceCount) : undefined}
            onValueChange={(value) =>
              setDifficulty.mutate({
                activity,
                choiceCount: Number(value),
              })
            }
          >
            <SelectTrigger aria-label={t("settings.choicesLabel")}>
              <SelectValue placeholder={t("settings.choicesLabel")} />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}

export default function SettingsRoute() {
  const t = useT();
  const agentSettingsTabs = useAgentSettingsTabs({ extensionTools: true });
  useSetPageTitle(t("header.pageSettings"));

  return (
    <SettingsTabsPage
      extraTabs={agentSettingsTabs}
      general={
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <SettingsGroup>
            <SettingsRow
              id="language"
              label={t("settings.languageTitle")}
              description={t("settings.languageDescription")}
              control={
                <div className="w-56">
                  <LanguagePicker label={t("settings.languageLabel")} />
                </div>
              }
            />
          </SettingsGroup>

          <SettingsGroup
            title={t("settings.difficultyTitle")}
            description={t("settings.difficultyDescription")}
          >
            <DifficultyRow activity="letter-sound" />
            <DifficultyRow activity="counting" />
            <DifficultyRow activity="color-shape" />
          </SettingsGroup>
        </div>
      }
    />
  );
}
