import { alpha } from "@mui/material";
import { ComponentOverride } from "../utils";

const MuiBackdrop: ComponentOverride["MuiBackdrop"] = {
  styleOverrides: {
    root: {},
  },
};

export default MuiBackdrop;
