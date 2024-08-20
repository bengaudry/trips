export type AppColors = {
  accent: string;
  border: string;
  focusedBorder: string;
  appBackground: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  subtleBackground: string;
  invertedPrimaryTextColor: string;
  shadow: string;

  // Colors (toasts)
  dangerBackground: string;
  infoBackground: string;
  successBackground: string;
  warningBackground: string;
};

type Colors = {
  dark: AppColors;
  light: AppColors;
};

const colors: Colors = {
  light: {
    accent: "#430FBA",
    border: "#e6e6e6",
    focusedBorder: "#c6c6c6",
    appBackground: "#ffffff",
    primaryTextColor: "#212126",
    secondaryTextColor: "#939295",
    subtleBackground: "#f7f7f8",
    invertedPrimaryTextColor: "#ffffff",
    shadow: "#121212",

    // Colors (toasts)
    dangerBackground: "#fad5da",
    infoBackground: "#d2e4f2",
    successBackground: "#d7eddc",
    warningBackground: "#f3e6d2",
  },
  dark: {
    accent: "#430FBA",
    border: "#727272",
    focusedBorder: "#484848",
    appBackground: "#000",
    primaryTextColor: "#fff",
    secondaryTextColor: "#c6c6c6",
    subtleBackground: "#242424",
    invertedPrimaryTextColor: "#000",
    shadow: "#c2c2c2",

    // Colors (toasts)
    dangerBackground: "#e11c47",
    infoBackground: "#1e8ed6", //#0083c6
    successBackground: "#8acba0",
    warningBackground: "#cb8a03",
  },
};

export default colors;
