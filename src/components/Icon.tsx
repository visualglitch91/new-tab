import { clsx } from "../utils/general";

export default function Icon({
  className,
  icon,
  size = 24,
  style: extraStyles,
}: {
  className?: string;
  icon: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size,
    minWidth: size,
    minWeight: size,
    maxWidth: size,
    maxWeight: size,
    ...extraStyles,
  };

  if (icon.startsWith("icofont-")) {
    return <i style={style} className={clsx("icofont", icon, className)} />;
  }

  const name =
    icon.startsWith("mdi:") || icon.startsWith("mdi-") ? icon.slice(4) : icon;

  return <i style={style} className={clsx("mdi", `mdi-${name}`, className)} />;
}
