import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";
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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .component__list-card-row__icon-wrapper--has-click {
    cursor: pointer;
    border-radius: 100%;
    transition: background 100ms linear;
  }

  .component__list-card-row__icon-wrapper--has-click:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .component__list-card-row__label {
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .component__list-card-row__divider {
    height: 1px;
    background-color: rgb(36, 46, 66);
  }
`);

export default function ListCardRow({ icon, label, children, onIconClick }) {
  return h`
    <div class="component__list-card-row">
      ${
        Boolean(icon) &&
        h`<div
            class=${clsx(
              "component__list-card-row__icon-wrapper",
              onIconClick && "component__list-card-row__icon-wrapper--has-click"
            )}
            onClick=${onIconClick}
          >
          <${MaterialIcon} icon=${icon} />
        </div>`
      }
      <div class="component__list-card-row__label">${label}</div>
      <div>${children}</div>
    </div>
  `;
}
