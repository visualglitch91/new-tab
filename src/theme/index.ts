import { createTheme } from "@mui/material";
import { applyCustomColors } from "./colors";

function getModuleName(filePath: string) {
  return filePath.match(/\/([^/]+)\.ts$/)?.[1] || null;
}

// Load all overrides from folder dinamically
const overrides = Object.entries(
  //@ts-expect-error
  import.meta.glob("./overrides/*.ts", { eager: true })
).reduce(
  //@ts-expect-error
  (acc, [key, { default: module }]) => ({
    ...acc,
    //@ts-expect-error
    [getModuleName(key)]: module,
  }),
  {}
);

console.log("Overrides loaded:", Object.keys(overrides));

const baseOverrides = {
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "San Francisco",
  },
  components: overrides,
};

const theme = applyCustomColors(
  createTheme({
    ...baseOverrides,
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1000,
        lg: 1300,
        xl: 1700,
      },
    },
    palette: {
      mode: "dark",
      primary: { main: "#ff79c6" },
      secondary: { main: "#885ba3" },
    },
  })
);

export default theme;
