import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";

css(`
  .component__stack {
    display: flex;
    grid-gap: 16px;
  }

  .component__stack--small-gap { grid-gap: 8px; }
  .component__stack--vertical { flex-direction: column; }
  .component__stack--horizontal { flex-direction: row; }
  .component__stack--horizontal > * { flex: 1; }
  `);

export default function Stack({
  class: className,
  horizontal,
  smallGap,
  children,
}) {
  return h`
    <div class=${clsx(
      "component__stack",
      `component__stack--${horizontal ? "horizontal" : "vertical"}`,
      smallGap && "component__stack--small-gap",
      className
    )}>
      ${children}
    </div>
  `;
}
