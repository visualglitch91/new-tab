import { RGB } from "./general";

const colorPresetMap: Record<string, { real: RGB; display?: RGB }> = {
  RED: { real: [255, 0, 0], display: [234, 32, 39] },
  BLUE: { real: [0, 0, 255], display: [6, 82, 221] },
  GREEN: { real: [0, 255, 0], display: [39, 174, 96] },
  PURPLE: { real: [129, 1, 255], display: [142, 68, 173] },
  ORANGE: { real: [255, 64, 0], display: [255, 116, 21] },
  CORAL: { real: [255, 28, 37], display: [255, 28, 137] },
  LIGHT_BLUE: { real: [0, 255, 255], display: [72, 219, 251] },
  TEAL: { real: [0, 255, 128], display: [0, 255, 213] },
};

export const colorPresets = Object.values(colorPresetMap).map((it) => it.real);

export function getDisplayColor(color: RGB) {
  const mappedColor = Object.values(colorPresetMap).find((it) =>
    isColorEqual(color, it.real)
  );

  return mappedColor?.display || color;
}

export function getDisplayColorString(color: RGB, alpha = 1) {
  const rgb = getDisplayColor(color);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function isColorEqual(a: RGB, b: RGB) {
  return a.every((value, index) => Math.abs(value - b[index]) < 3);
}
