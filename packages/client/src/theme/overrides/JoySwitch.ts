import { switchClasses } from "@mui/joy";
import { ComponentOverride, getColor } from "./utils";

const JoySwitch: ComponentOverride["JoySwitch"] = {
  styleOverrides: {
    root: ({ ownerState, theme }) => {
      const color = getColor(ownerState);

      return {
        display: "inherit",
        "--Switch-thumbShadow":
          "rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px",
        "--Switch-thumbSize": "20px",
        "--Switch-trackWidth": "34px",
        "--Switch-trackHeight": "14px",
        "--Switch-thumbBackground": theme.palette.neutral[400],
        "--Switch-trackBackground": theme.palette.neutral[900],
        "&:hover": {
          "--Switch-thumbBackground": theme.palette.neutral[400],
          "--Switch-trackBackground": theme.palette.neutral[900],
        },
        [`&.${switchClasses.checked}`]: {
          "--Switch-thumbBackground": theme.palette[color][400],
          "--Switch-trackBackground": theme.palette.neutral[900],
          "&:hover": {
            "--Switch-thumbBackground": theme.palette[color][300],
            "--Switch-trackBackground": theme.palette.neutral[900],
          },
        },
        [`&.${switchClasses.disabled}`]: {
          opacity: 0.6,
        },
        [`& .${switchClasses.thumb}`]: {
          transition: "width 70ms, left 70ms",
        },
      };
    },
  },
};

export default JoySwitch;
