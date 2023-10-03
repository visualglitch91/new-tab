import { ComponentOverride } from "../utils";

const MuiBottomNavigation: ComponentOverride["MuiBottomNavigation"] = {
  styleOverrides: {
    root: {
      height: 62,
      backdropFilter: "blur(10px)",
      background: "rgba(200,200,200, 0.2)",
      "& .Mui-selected": { color: "white !important" },
    },
  },
};

export default MuiBottomNavigation;
