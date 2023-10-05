import { Components, Theme, SxProps as MuiSxProps, alpha } from "@mui/material";
import devicePerformance from "../utils/devicePerformance";

export type ComponentOverride = Components<Omit<Theme, "components">>;

export type SxProps = MuiSxProps<Theme>;

export function getBlurredBackground(
  color: string,
  opacity: number,
  blur = 10
) {
  const performance = devicePerformance.getScore();

  return performance < 1000
    ? {
        backdropFilter: `blur(${blur}px)`,
        background: alpha(color, opacity),
      }
    : {
        background: alpha(color, opacity),
      };
}
