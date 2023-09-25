import { alpha } from "../utils/styles";

export default function ColorBadge({
  color,
  radius = "100%",
  size = 10,
  border = false,
  style,
}: {
  color: string;
  size?: number | string;
  radius?: number | string;
  border?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: radius,
        background: alpha(color, 0.9),
        boxSizing: "border-box",
        border: border ? "1px solid rgba(0, 0, 0, 0.1)" : undefined,
        ...style,
      }}
    />
  );
}
