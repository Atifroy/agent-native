import { createAgentNativeI18nCatalog } from "@agent-native/core/client/i18n";

import enUS from "./en-US";

// Only en-US ships today; agent-native.config.ts does not list additional
// translations.locales. supportedLocales keeps <LanguagePicker /> from
// offering a locale this catalog cannot actually load.
export const i18nCatalog = createAgentNativeI18nCatalog({
  messages: enUS,
  localeLoaders: {},
  supportedLocales: ["en-US"],
});
