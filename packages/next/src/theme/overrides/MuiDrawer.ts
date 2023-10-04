import { ComponentOverride, getBlurredBackground } from "../utils";

const MuiDrawer: ComponentOverride["MuiDrawer"] = {
  styleOverrides: {
    paper: {
      ...getBlurredBackground("#aaaaaa", 0.3, 20),
    },
  },
};

export default MuiDrawer;
