import { clsx } from "../utils/general";

export default function MaterialIcon({
  class: className,
  icon,
  size,
}: {
  class?: string;
  icon: string;
  size?: number;
}) {
  const [, name] = icon.split(":");

  return (
    <i
      style={size ? { fontSize: `${size}px` } : undefined}
      class={clsx("mdi", `mdi-${name}`, className)}
    />
  );
}
