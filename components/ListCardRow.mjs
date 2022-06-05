import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import MaterialIcon from "./MaterialIcon.mjs";

css(`
  .component__list-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    column-gap: 12px;
  }

  .component__list-card-row__icon-wrapper {
    font-size: 24px;
    padding: 6px;
  }

  .component__list-card-row__label {
    margin-right: auto;
  }

  .component__list-card-row__divider {
    height: 1px;
    background-color: rgb(36, 46, 66);
  }
`);

export default function ListCardRow({ icon, label, children }) {
  return h`
    <div class="component__list-card-row">
      ${
        Boolean(icon) &&
        h`<div class="component__list-card-row__icon-wrapper"><${MaterialIcon} icon=${icon} /></div>`
      }
      <div class="component__list-card-row__label">${label}</div>
      <div>${children}</div>
    </div>
  `;
}
