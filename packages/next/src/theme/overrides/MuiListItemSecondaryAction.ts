import { ComponentOverride } from "../utils";

const MuiListItemSecondaryAction: ComponentOverride["MuiListItemSecondaryAction"] =
  {
    styleOverrides: {
      root: {
        "& .MuiSwitch-root": { transform: "translateX(12px)" },
      },
    },
  };

export default MuiListItemSecondaryAction;
