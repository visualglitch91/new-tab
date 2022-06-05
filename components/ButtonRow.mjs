import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";

css(`
  .module__tv__button-row {
    width: 100%;
    display: flex;
    grid-gap: 8px;
    overflow: hidden;
  }

  .module__tv__button-row > * {
    flex: 1;
    overflow: hidden;
  }
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
