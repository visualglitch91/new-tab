import { ComponentOverride } from "../utils";

const MuiDialogActions: ComponentOverride["MuiDialogActions"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: "0 24px 16px",
      ".MuiDialogContent-dividers + &": {
        paddingTop: "16px",
      },
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        gap: "16px",
        "& > *": { flex: 1 },
      },
    }),
  },
  defaultProps: {},
};

export default MuiDialogActions;
