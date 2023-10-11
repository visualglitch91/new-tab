import { alpha } from "@mui/material";
import { ComponentOverride } from "../utils";

const MuiBackdrop: ComponentOverride["MuiBackdrop"] = {
  styleOverrides: {
    root: {
      background: alpha("#2f3b52", 0.5),
    },
  },
};

export default MuiBackdrop;
