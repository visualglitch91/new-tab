import { Theme, createTheme } from "@mui/material";

const customColors = {
  white: "#F0F0F4",
  glossy: "#f0f0f426",
  darkPrimary: "#9f3572",
};

type CustomColors = keyof typeof customColors;

type ColorOverrides = {
  [key in CustomColors]: true;
};

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

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides extends ColorOverrides {}
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides extends ColorOverrides {}
}

export function applyCustomColors(theme: Theme) {
  return createTheme(theme, {
    palette: Object.entries(customColors).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: theme.palette.augmentColor({
          color: { main: value },
          name: key,
        }),
      }),
      {}
    ),
  });
}
