import { ComponentOverride } from "../utils";

const MuiListItemIcon: ComponentOverride["MuiListItemIcon"] = {
  styleOverrides: {
    root: {
      minWidth: "32px",
      alignItems: "center",
    },
  },
};

export default MuiListItemIcon;
