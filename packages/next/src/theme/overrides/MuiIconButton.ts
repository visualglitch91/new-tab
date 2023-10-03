import { ComponentOverride } from "../utils";

const MuiIconButton: ComponentOverride["MuiIconButton"] = {
  styleOverrides: {
    root: {
      "&.MuiIconButton-containedGlossy": { color: "white" },
      "&.MuiIconButton-outlinedGlossy": { color: "white" },
    },
  },
};

export default MuiIconButton;
