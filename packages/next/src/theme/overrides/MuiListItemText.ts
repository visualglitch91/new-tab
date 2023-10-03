import { ComponentOverride } from "../utils";

const MuiListItemText: ComponentOverride["MuiListItemText"] = {
  styleOverrides: {
    primary: { fontWeight: 500 },
  },
};

export default MuiListItemText;
