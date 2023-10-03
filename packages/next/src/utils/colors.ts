export type RGB = [number, number, number];

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

export function rgbToHex([r, g, b]: RGB) {
  //eslint-disable-next-line
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHS([r, g, b]: RGB) {
  let computedH = 0;
  let computedS = 0;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  const minRGB = Math.min(r, Math.min(g, b));
  const maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB === maxRGB) {
    return [0, 0];
  }

  // Colors other than black-gray-white:
  const d = r === minRGB ? g - b : b === minRGB ? r - g : b - r;
  const h = r === minRGB ? 3 : b === minRGB ? 1 : 5;

  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = 100 * ((maxRGB - minRGB) / maxRGB);

  return [computedH, computedS];
}

export function hsvToRGB(h: number, s: number, v: number) {
  h /= 360;
  s /= 100;
  v /= 100;

  let r = 0;
  let g = 0;
  let b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [r * 255, g * 255, b * 255].map(Math.round) as RGB;
}

export function getContrastColor(color: RGB) {
  // https://stackoverflow.com/a/3943023/112731
  return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186
    ? "#000000"
    : "#FFFFFF";
}
