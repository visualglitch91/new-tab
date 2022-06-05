import { h, clsx } from "../utils.mjs";

export default function MaterialIcon({ class: className, icon }) {
  const [, name] = icon.split(":");

  return h`
    <i class=${clsx("mdi", `mdi-${name}`, className)} />
  `;
}
