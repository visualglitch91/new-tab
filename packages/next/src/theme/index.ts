import { createTheme } from "@mui/material";
import MuiDrawer from "./overrides/MuiDrawer";
import MuiButton from "./overrides/MuiButton";
import { applyCustomColors } from "./colors";
import MuiBottomNavigation from "./overrides/MuiBottomNavigation";
import MuiIconButton from "./overrides/MuiIconButton";
import MuiListItemText from "./overrides/MuiListItemText";
import MuiListItemIcon from "./overrides/MuiListItemIcon";
import MuiListItemSecondaryAction from "./overrides/MuiListItemSecondaryAction";

const theme = applyCustomColors(
  createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#ff79c6" },
      secondary: { main: "#885ba3" },
    },
    typography: {
      fontFamily: "San Francisco",
    },
    components: {
      MuiDrawer,
      MuiButton,
      MuiBottomNavigation,
      MuiIconButton,
      MuiListItemText,
      MuiListItemIcon,
      MuiListItemSecondaryAction,
    },
  })
);

export default theme;
