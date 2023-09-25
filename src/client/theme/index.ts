import { extendTheme } from "@mui/joy/styles";
import JoySwitch from "./overrides/JoySwitch";
import JoyLinearProgress from "./overrides/JoyLinearProgress";
import JoyCircularProgress from "./overrides/JoyCircularProgress";
import JoySlider from "./overrides/JoySlider";

function getImage(name: string) {
  return new URL(`./${name}`, import.meta.url).href;
}

declare module "@mui/joy/styles" {
  interface Theme {
    wallpaper: {
      mobile: string;
      desktop: string;
    };
  }
}

const theme = {
  ...extendTheme({
    components: {
      JoySwitch,
      JoyLinearProgress,
      JoyCircularProgress,
      JoySlider,
    },
    colorSchemes: {
      dark: {
        palette: {
          text: {
            secondary: "var(--joy-palette-common-white)",
            primary: "var(--joy-palette-common-white)",
          },
          primary: {
            50: "#fee4ea",
            100: "#febccc",
            200: "#fc90aa",
            300: "#fa6489",
            400: "#f6426f",
            500: "#f32457",
            600: "#e21f55",
            700: "#cc1951",
            800: "#b8114f",
            900: "#94064a",
          },
          neutral: {
            50: "#e8ecfe",
            100: "#c8d3e7",
            200: "#aab5ce",
            300: "#8a98b5",
            400: "#7383a1",
            500: "#5c6e8f",
            600: "#4f607e",
            700: "#3e4d68",
            800: "#2f3b52",
            900: "#1c273a",
          },
          background: {
            body: "#282a36",
            popup: "#282a36",
          },
        },
      },
    },
  }),
  wallpaper: {
    mobile: getImage("background-mobile.jpg"),
    desktop: getImage("background-desktop.jpg"),
  },
};

export default theme;
