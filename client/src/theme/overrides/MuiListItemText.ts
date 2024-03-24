import { ComponentOverride } from "../utils";

const MuiListItemText: ComponentOverride["MuiListItemText"] = {
  styleOverrides: {
    primary: { fontWeight: 500 },
    root: {
      ".MuiListItemIcon-root + &": {
        marginLeft: "12px",
      },
    },
  },
};

export default MuiListItemText;
