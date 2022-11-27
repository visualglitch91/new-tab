export default function ColorBadge({
  color,
  radius = "100%",
  size = 10,
  style,
}: {
  color: string;
  size?: number | string;
  radius?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: radius,
        background: color,
        ...style,
      }}
    />
  );
}
