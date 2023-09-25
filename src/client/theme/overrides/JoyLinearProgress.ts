import { ComponentOverride, getColor } from "./utils";

const JoyLinearProgress: ComponentOverride["JoyLinearProgress"] = {
  styleOverrides: {
    root: ({ ownerState, theme }) => ({
      ...{
        color: theme.palette[getColor(ownerState)][400],
        borderColor: "currentColor",
      },
    }),
  },
};

export default JoyLinearProgress;
