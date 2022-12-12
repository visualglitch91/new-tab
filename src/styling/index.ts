export { css, keyframes } from "./css";
export { styled } from "./styled";
export * from "./utils";

function createPallete(base: string) {
  return {
    l120: lighten(base, 1.2),
    l90: lighten(base, 0.9),
    l60: lighten(base, 0.6),
    l30: lighten(base, 0.3),
    l10: lighten(base, 0.1),
    base,
    d10: darken(base, 0.1),
    d30: darken(base, 0.3),
    d60: darken(base, 0.6),
    d90: darken(base, 0.9),
    d120: darken(base, 1.2),
  };
}

function hexToRGB(hex: string): [number, number, number] {
  return [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ];
}

function shadeColor(hex: string, percent: number) {
  let [R, G, B] = hexToRGB(hex);

  R = R * (1 + percent);
  G = G * (1 + percent);
  B = B * (1 + percent);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = Math.round(R).toString(16).padStart(2, "0");
  const GG = Math.round(G).toString(16).padStart(2, "0");
  const BB = Math.round(B).toString(16).padStart(2, "0");

  return "#" + RR + GG + BB;
}

export function lighten(hex: string, percent: number) {
  return shadeColor(hex, percent);
}

export function darken(hex: string, percent: number) {
  return shadeColor(hex, -percent);
}

export function alpha(hex: string, percent: number) {
  const [R, G, B] = hexToRGB(hex);
  return `rgba(${R}, ${G}, ${B},${percent})`;
}

export const theme = {
  accent: createPallete("#f64270"),
  background: createPallete("#2f3b52"),
};
