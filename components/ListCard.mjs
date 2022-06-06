import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import Paper from "./Paper.mjs";
import EntityRow from "./EntityRow.mjs";
import EntitiesSwitch from "./EntitiesSwitch.mjs";

css(`
  .component__list-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    column-gap: 8px;
  }

  .component__list-card__header h2 {
    margin: 0;
    font-size: 18px;
    line-height: 32px;
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

export default function ListCard({
  class: className,
  title,
  rows,
  showGroupSwitch,
}) {
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

  const groupedEntityIds = rows
    .filter((it) => {
      return ["light", "switch", "input_boolean"].includes(
        it.entityId?.split(".")[0]
      );
    })
    .map((it) => it.entityId);

  return h`
    <${Paper} class=${className}>
      ${
        Boolean(title) &&
        h`
          <div class="component__list-card__header">
            <h2>${title}</h2>
            ${
              showGroupSwitch &&
              Boolean(groupedEntityIds.length) &&
              h`<${EntitiesSwitch} entityIds=${groupedEntityIds} />`
            }
          </div>
        `
      }
      <div class="component__list-card__content">
        ${rows.map(renderRow)}
      </div>
    </${Paper}>
  `;
}
