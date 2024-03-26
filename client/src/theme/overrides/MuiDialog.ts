import { alpha } from "@mui/material";
import { ComponentOverride, getBlurredBackground } from "../utils";

const MuiDialog: ComponentOverride["MuiDialog"] = {
  styleOverrides: {
    paper: {
      ...getBlurredBackground("#1a212e", 0.9, 18),
      boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
      minWidth: 360,
    },
    root: {
      "& .MuiBackdrop-root": {
        background: alpha("#2f3b52", 0.5),
      },
    },
  },
};

export default MuiDialog;
