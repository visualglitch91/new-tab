import { getConfig } from "../../utils/useConfig";
import { ComponentOverride, getBlurredBackground } from "../utils";

const disableBlurEffects = getConfig("disableBlurEffects") === true;

const MuiDrawer: ComponentOverride["MuiDrawer"] = {
  styleOverrides: {
    paper: disableBlurEffects
      ? { backgroundColor: "rgba(50, 63, 93, 0.8)" }
      : { ...getBlurredBackground("#aaaaaa", 0.3, 20) },
  },
};

export default MuiDrawer;
