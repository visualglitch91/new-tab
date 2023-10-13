import { ComponentOverride } from "../utils";

const MuiBottomNavigation: ComponentOverride["MuiBottomNavigation"] = {
  styleOverrides: {
    root: {
      zIndex: 1,
      height: 62,
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(28, 34, 48,0.5)",
      "& .Mui-selected": { color: "white !important" },
    },
  },
};

export default MuiBottomNavigation;
