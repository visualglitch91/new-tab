import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";

css(`
  .module__tv__button-row {
    width: 100%;
    display: flex;
    grid-gap: 8px;
  }

  .module__tv__button-row > * { flex: 1; }
`);

export default function ButtonRow({ children, height }) {
  return h`
    <div
      style=${{ height: height && `${height}px` }}
      class="module__tv__button-row"
    >
      ${children}
    </div>`;
}
