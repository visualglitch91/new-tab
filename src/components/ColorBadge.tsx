import { JSXInternal } from "preact/src/jsx";
import { getDisplayColor } from "../utils/colorPresets";
import { getContrastColor, RGB } from "../utils/general";

function getColorBadgeStyle(color: RGB, size = 10) {
  const displayColor = getDisplayColor(color);

  return {
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: 4,
    border: `1px solid ${getContrastColor(displayColor)}`,
    background: `rgb(${displayColor[0]},${displayColor[1]},${displayColor[2]})`,
  };
}

export default function ColorBadge({
  color,
  size,
  style,
}: {
  color: RGB;
  size?: number;
  style?: JSXInternal.CSSProperties;
}) {
  return <span style={{ ...getColorBadgeStyle(color, size), ...style }} />;
}
