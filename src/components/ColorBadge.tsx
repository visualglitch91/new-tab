import { JSXInternal } from "preact/src/jsx";
import { getDisplayColor } from "../utils/colorPresets";
import { RGB } from "../utils/general";

function getColorBadgeStyle(
  color: RGB,
  radius: number | string = "100%",
  size: number | string = 10
) {
  const displayColor = getDisplayColor(color);

  return {
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: radius,
    background: `rgb(${displayColor[0]}, ${displayColor[1]}, ${displayColor[2]})`,
  };
}

export default function ColorBadge({
  color,
  size,
  radius,
  style,
}: {
  color: RGB;
  size?: number | string;
  radius?: number | string;
  style?: JSXInternal.CSSProperties;
}) {
  return (
    <span style={{ ...getColorBadgeStyle(color, radius, size), ...style }} />
  );
}
