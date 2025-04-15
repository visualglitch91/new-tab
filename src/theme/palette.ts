import { createTheme, Palette, PaletteOptions } from "@mui/material";

const augmentColor = createTheme().palette.augmentColor;

const catppuccinMocha = {
  rosewater: "#f5e0dc",
  flamingo: "#f2cdcd",
  pink: "#f5c2e7",
  mauve: "#cba6f7",
  red: "#f38ba8",
  maroon: "#eba0ac",
  peach: "#fab387",
  yellow: "#f9e2af",
  green: "#a6e3a1",
  teal: "#94e2d5",
  sky: "#89dceb",
  sapphire: "#74c7ec",
  blue: "#89b4fa",
  lavender: "#b4befe",
  text: "#cdd6f4",
  subtext: "#bac2de",
  base: "#1e1e2e",
  mantle: "#181825",
  crust: "#11111b",
};

const customColors = {
  ...catppuccinMocha,
  white: "#F0F0F4",
  glossy: "#f0f0f426",
  darkPrimary: "#9f3572",
};

type CustomColors = keyof typeof customColors;

declare module "@mui/material/styles" {
  type CustomPalette = {
    [key in CustomColors]: Palette["primary"];
  };

  type CustomPaletteOptions = {
    [key in CustomColors]?: PaletteOptions["primary"];
  };

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPaletteOptions {}
}

export type PaletteColors = keyof Omit<
  Palette,
  | "common"
  | "mode"
  | "contrastThreshold"
  | "tonalOffset"
  | "grey"
  | "text"
  | "divider"
  | "action"
  | "background"
  | "getContrastText"
  | "augmentColor"
>;

const customPaletteColors = Object.entries(customColors).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: augmentColor({ color: { main: value }, name: key }),
  }),
  {}
);

const palette: PaletteOptions = {
  mode: "dark",
  ...customPaletteColors,
  primary: {
    main: customColors.white,
  },
  secondary: {
    main: catppuccinMocha.mauve,
  },
  background: {
    default: catppuccinMocha.base,
    paper: "#24273a",
  },
  text: {
    primary: catppuccinMocha.text,
    secondary: catppuccinMocha.subtext,
  },
  error: {
    main: catppuccinMocha.red,
  },
  warning: {
    main: catppuccinMocha.peach,
  },
  info: {
    main: catppuccinMocha.sky,
  },
  success: {
    main: catppuccinMocha.green,
  },
};

export default palette;
