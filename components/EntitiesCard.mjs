import { h, clsx, useHass, css, getIcon } from "../utils.mjs";
import Switch from "./Switch.mjs";
import Paper from "./Paper.mjs";
import MaterialIcon from "./MaterialIcon.mjs";

css(`
  .component__entities-card__header {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px 0;
  }

  .component__entities-card__header h2 {
    margin: 0;
    font-size: 24px;
    line-height: 48px;
  }

  .component__entities-card__content {
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px;
    row-gap: 8px;
  }

  .component__entities-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    column-gap: 12px;
  }

  .component__entities-card-row__icon-wrapper {
    font-size: 24px;
    padding: 6px;
  }

  .component__entities-card-row__label {
    margin-right: auto;
  }
`);

function EntitiesCardRow({ icon, label, children }) {
  return h`
    <div class="component__entities-card-row">
      ${
        Boolean(icon) &&
        h`<div class="component__entities-card-row__icon-wrapper"><${MaterialIcon} icon=${icon} /></div>`
      }
      <div class="component__entities-card-row__label">${label}</div>
      <div>${children}</div>
    </div>
  `;
}

export default function EntitiesCard({ class: className, title, rows }) {
  const hass = useHass();

  function renderRow(row) {
    switch (row.type) {
      case undefined:
      case "entity":
        const entity = hass.states[row.entityId];
        const icon = row.icon || entity?.attributes?.icon || getIcon(entity);

        if (!entity) {
          return h`
            <${EntitiesCardRow} icon=${icon} label=${row.entityId}>
              unavailable
            </${EntitiesCardRow}>
          `;
        }

        const { state, attributes } = entity;
        const { friendly_name: friendlyName } = attributes;
        const [domain] = row.entityId.split(".");
        const checked = state === "on";

        return h`
          <${EntitiesCardRow} icon=${icon} label=${row.label || friendlyName}>
            ${
              row.renderContent
                ? row.renderContent(entity)
                : domain === "light" || domain === "switch"
                ? h`<${Switch}
                      checked=${checked}
                      onInput=${() => {
                        hass.callService(
                          "homeassistant",
                          checked ? "turn_off" : "turn_on",
                          { entity_id: row.entityId }
                        );
                      }} />`
                : entity.state
            }
          </${EntitiesCardRow}>
        `;
      default:
        return null;
    }
  }

  return h`
    <${Paper} class=${clsx("component__paper", className)}>
      ${
        Boolean(title) &&
        h`
          <div class="component__entities-card__header">
            <h2>${title}</h2>
          </div>
        `
      }
      <div class="component__entities-card__content">
        ${rows.map(renderRow)}
      </div>
    </${Paper}>
  `;
}
