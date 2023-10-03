import { createTheme } from "@mui/material";
import MuiDrawer from "./overrides/MuiDrawer";
import MuiButton from "./overrides/MuiButton";
import { applyCustomColors } from "./colors";
import MuiBottomNavigation from "./overrides/MuiBottomNavigation";
import MuiIconButton from "./overrides/MuiIconButton";

const theme = applyCustomColors(
  createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#ff79c6" },
      secondary: { main: "#8be9fd" },
    },
    typography: {
      fontFamily: "San Francisco",
    },
    components: {
      MuiDrawer,
      MuiButton,
      MuiBottomNavigation,
      MuiIconButton,
    },
  })
);

export default theme;
