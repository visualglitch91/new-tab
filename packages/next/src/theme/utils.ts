import { Components, Theme, SxProps as MuiSxProps, alpha } from "@mui/material";
import { getDevicePerformance } from "../utils/general";
import { getAssetUrl } from "../assets";

export type ComponentOverride = Components<Omit<Theme, "components">>;

export type SxProps = MuiSxProps<Theme>;

const performance = getDevicePerformance();

export function getBlurredBackground(
  color: string,
  opacity: number,
  blur = 10
) {
  return performance < 1000
    ? {
        backdropFilter: `blur(${blur}px)`,
        background: alpha(color, opacity),
      }
    : {
        background: alpha(color, opacity),
      };
}
