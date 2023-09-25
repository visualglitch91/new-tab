import type { ColorPaletteProp, Components, Theme } from "@mui/joy";

export type ComponentOverride = Components<Theme>;

export function getColor(ownerState: any) {
  return (ownerState.color || "primary") as ColorPaletteProp;
}
