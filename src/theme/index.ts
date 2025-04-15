import { createTheme } from "@mui/material";
import palette from "./palette";

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
    fontFamily: '"Fira Sans", "San Francisco"',
  },
  components: overrides,
};

const theme = createTheme({
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
  palette,
});

export default theme;
