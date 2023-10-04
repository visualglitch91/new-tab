import { ComponentOverride, getBlurredBackground } from "../utils";

const MuiDialog: ComponentOverride["MuiDialog"] = {
  styleOverrides: {
    paper: {
      ...getBlurredBackground("#1a212e", 0.8, 10),
      boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
      minWidth: 360,
    },
  },
  defaultProps: {},
};

export default MuiDialog;
