import { JSXInternal } from "preact/src/jsx";
import { getContrastColor, RGB } from "../utils/general";

function getColorBadgeStyle(color: RGB, size = 10) {
  return {
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: 4,
    border: `1px solid ${getContrastColor(color)}`,
    background: `rgb(${color[0]},${color[1]},${color[2]})`,
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
