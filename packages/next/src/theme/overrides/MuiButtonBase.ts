import { ComponentOverride } from "../utils";

const MuiButtonBase: ComponentOverride["MuiButtonBase"] = {
  styleOverrides: {
    root: { "&:hover": "unset" },
  },
};

export default MuiButtonBase;
