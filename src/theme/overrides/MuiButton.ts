import { ComponentOverride } from "../utils";

const MuiButton: ComponentOverride["MuiButton"] = {
  styleOverrides: {
    root: {
      "&.MuiButton-containedGlossy": { color: "white" },
      "&.MuiButton-outlinedGlossy": { color: "white" },
    },
    outlinedSecondary: {
      color: "white",
    },
  },
  defaultProps: {
    variant: "outlined",
  },
};

export default MuiButton;
