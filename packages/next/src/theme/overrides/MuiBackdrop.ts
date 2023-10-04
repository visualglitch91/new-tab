import { ComponentOverride, getBlurredBackground } from "../utils";

const MuiBackdrop: ComponentOverride["MuiBackdrop"] = {
  styleOverrides: {
    root: {
      ...getBlurredBackground("#2f3b52", 0.2, 2),
    },
  },
};

export default MuiBackdrop;
