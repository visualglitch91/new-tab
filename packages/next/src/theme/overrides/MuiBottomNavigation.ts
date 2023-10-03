import { ComponentOverride } from "../utils";

const MuiBottomNavigation: ComponentOverride["MuiBottomNavigation"] = {
  styleOverrides: {
    root: {
      height: 62,
      backdropFilter: "blur(10px)",
      background: "rgba(180, 180, 180, 0.3)",
      "& .Mui-selected": { color: "white !important" },
    },
  },
};

export default MuiBottomNavigation;
