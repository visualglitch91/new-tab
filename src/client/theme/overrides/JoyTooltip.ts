import { ComponentOverride, getColor } from "./utils";
import { alpha } from "../../utils/styles";

const JoyTooltip: ComponentOverride["JoyTooltip"] = {
  defaultProps: {
    arrow: true,
    enterDelay: 3_000,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: "none",
      padding: "8px 12px",
      background: alpha(theme.palette.background.body, 0.9),
    }),
    arrow: ({ theme }) => ({
      boxShadow: "none",
      color: alpha(theme.palette.background.body, 0.9),
      "&:before": {
        borderTopColor: "currentColor",
        borderRightColor: "currentColor",
      },
    }),
  },
};

export default JoyTooltip;
