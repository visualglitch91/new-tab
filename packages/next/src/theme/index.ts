import { createTheme } from "@mui/material";
import { applyCustomColors } from "./colors";

function getModuleName(filePath: string) {
  return filePath.match(/\/([^/]+)\.ts$/)?.[1] || null;
}

// Load all overrides from folder dinamically
const overrides = Object.entries(
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
    palette: {
      mode: "dark",
      primary: { main: "#ff79c6" },
      secondary: { main: "#885ba3" },
    },
  })
);

export default theme;
