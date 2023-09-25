import { ComponentOverride, getColor } from "./utils";

const JoySlider: ComponentOverride["JoySlider"] = {
  styleOverrides: {
    root: ({ ownerState, theme }) => {
      const color = getColor(ownerState);

      return {
        "--Slider-trackSize": "4px",
        "--Slider-trackBackground": theme.palette[color][400],
        "--Slider-trackColor": theme.palette[color][400],
        "--Slider-thumbBackground": theme.palette[color][400],
        "--Slider-thumbColor": theme.palette[color][400],
        "&:hover": {
          "--Slider-trackBackground": theme.palette[color][400],
          "--Slider-trackColor": theme.palette[color][400],
          "--Slider-thumbBackground": theme.palette[color][300],
          "--Slider-thumbColor": theme.palette[color][300],
        },
      };
    },
  },
};

export default JoySlider;
