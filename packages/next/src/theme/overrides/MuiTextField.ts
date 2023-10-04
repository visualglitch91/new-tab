import { ComponentOverride } from "../utils";

const MuiTextField: ComponentOverride["MuiTextField"] = {
  styleOverrides: {},
  defaultProps: {
    variant: "outlined",
    size: "small",
  },
};

export default MuiTextField;
