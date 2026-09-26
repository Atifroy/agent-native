const rawAppName = "learning-garden";
const rawAppTitle = "Rayya's Learning Garden";

const APP_NAME_PLACEHOLDER = "{" + "{APP_NAME}}";
const APP_TITLE_PLACEHOLDER = "{" + "{APP_TITLE}}";

export const APP_NAME =
  rawAppName === APP_NAME_PLACEHOLDER ? "learning-garden" : rawAppName;

export const APP_TITLE =
  rawAppTitle === APP_TITLE_PLACEHOLDER
    ? "Rayya's Learning Garden"
    : rawAppTitle;
