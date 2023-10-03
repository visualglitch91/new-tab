import { ComponentOverride } from "../utils";

const MuiDrawer: ComponentOverride["MuiDrawer"] = {
  styleOverrides: {
    paper: {
      backdropFilter: "blur(25px)",
      background: "rgba(170,170,170, 0.3)",
    },
    modal: {
      "& .MuiBackdrop-root": {
        background: "rgba(200,200,200, 0.1)",
      },
    },
  },
};

export default MuiDrawer;
