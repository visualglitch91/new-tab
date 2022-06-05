import { h } from "../utils/preact.mjs";
import { clsx } from "../utils/general.mjs";

export default function MaterialIcon({ class: className, icon, size }) {
  const [, name] = icon.split(":");

  return h`
    <i
      style=${size ? { fontSize: `${size}px` } : undefined}
      class=${clsx("mdi", `mdi-${name}`, className)}
    />`;
}
