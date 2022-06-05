import { h, clsx, css } from "../utils.mjs";

css(`
  .component__stack {
    display: flex;
    grid-gap:16px;
  }

  .component__stack--vertical { flex-direction: column; }
  .component__stack--horizontal { flex-direction: row; }
  .component__stack--horizontal > * { flex: 1; }
  `);

export default function Stack({ class: className, horizontal, children }) {
  return h`
    <div class=${clsx(
      "component__stack",
      `component__stack--${horizontal ? "horizontal" : "vertical"}`,
      className
    )}>
      ${children}
    </div>
  `;
}
