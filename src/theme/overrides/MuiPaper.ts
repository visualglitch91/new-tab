import { ComponentOverride } from "../utils";

const MuiPaper: ComponentOverride["MuiPaper"] = {
  styleOverrides: {
    root: { backgroundImage: "none" },
  },
};

export default MuiPaper;
