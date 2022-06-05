import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";
import EntityRow from "./EntityRow.mjs";
import Paper from "./Paper.mjs";

css(`
  .component__list-card__header {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px 0;
  }

  .component__list-card__header h2 {
    margin: 0;
    font-size: 24px;
    line-height: 48px;
  }

  .component__list-card__content {
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px;
    row-gap: 8px;
  }

  .component__list-card-row__divider {
    height: 1px;
    background-color: rgb(36, 46, 66);
  }
`);

export default function ListCard({ class: className, title, rows }) {
  function renderRow(row) {
    switch (row.type) {
      case undefined:
      case "entity":
        return h`<${EntityRow} ...${row} />`;
      case "divider":
        return h`<div class="component__list-card-row__divider" />`;
      case "custom":
        return row.render();
      default:
        return null;
    }
  }

  return h`
    <${Paper} class=${clsx("component__paper", className)}>
      ${
        Boolean(title) &&
        h`
          <div class="component__list-card__header">
            <h2>${title}</h2>
          </div>
        `
      }
      <div class="component__list-card__content">
        ${rows.map(renderRow)}
      </div>
    </${Paper}>
  `;
}
