//@ts-ignore
import colorParse from "color-rgba";

export function uniqueClassName() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}

export function cx(...classNames: (string | null | undefined | false | 0)[]) {
  return classNames.filter(Boolean).join(" ");
}

export function colorToHEX(color: any): [number, number, number] {
  const parsed = colorParse(color);
  return [parsed[0], parsed[1], parsed[2]];
}

function shadeColor(hex: string, percent: number) {
  let [R, G, B] = colorToHEX(hex);

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
  const [R, G, B] = colorToHEX(hex);
  return `rgba(${R}, ${G}, ${B},${percent})`;
}
