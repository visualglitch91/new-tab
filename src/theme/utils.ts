import { Components, Theme, SxProps as MuiSxProps, alpha } from "@mui/material";
import { getConfig } from "$app/utils/useConfig";

export type ComponentOverride = Components<Omit<Theme, "components">>;

export type SxProps = MuiSxProps<Theme>;

export function getBlurredBackground(
  color: string,
  opacity: number,
  blur = 10
) {
  const disableBlurEffects = getConfig("disableBlurEffects") === true;

  return disableBlurEffects
    ? {
        background: alpha(
          color,
          opacity < 0.8 ? Math.min(1, opacity + 0.6) : opacity
        ),
      }
    : {
        background: alpha(color, opacity),
        backdropFilter: `blur(${blur}px)`,
      };
}
