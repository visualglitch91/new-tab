import { alpha } from "../../utils/styles";
import { ComponentOverride, getColor } from "./utils";

const JoyCircularProgress: ComponentOverride["JoyCircularProgress"] = {
  defaultProps: {
    variant: "soft",
  },
  styleOverrides: {
    root: ({ ownerState, theme }) => ({
      ...(ownerState.variant === "soft" && {
        "--CircularProgress-progressColor":
          theme.palette[getColor(ownerState)][500],
        "--CircularProgress-trackColor": alpha(theme.palette.neutral[500], 0.3),
      }),
    }),
  },
};

export default JoyCircularProgress;
