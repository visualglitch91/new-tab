import { h } from "../utils/preact.mjs";
import {
  useHass,
  getIcon,
  showMoreInfo,
  makeServiceCall,
} from "../utils/hass.mjs";
import ListCardRow from "./ListCardRow.mjs";
import Switch from "./Switch.mjs";

export default function EntityRow({
  icon: customIcon,
  label,
  entityId,
  renderContent,
}) {
  const hass = useHass();

  const entity = hass.states[entityId];
  const icon = customIcon || entity?.attributes?.icon || getIcon(entity);

  if (!entity) {
    return h`
      <${ListCardRow} icon=${icon} label=${entityId}>
        unavailable
      </${ListCardRow}>`;
  }

  function onIconClick() {
    showMoreInfo(entityId);
  }

  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";

  return h`
    <${ListCardRow} icon=${icon} label=${
    label || friendlyName
  } onIconClick=${onIconClick}>
      ${
        renderContent
          ? renderContent(entity)
          : ["light", "switch", "input_boolean"].includes(domain)
          ? h`<${Switch}
                checked=${checked}
                onInput=${makeServiceCall(
                  "homeassistant",
                  checked ? "turn_off" : "turn_on",
                  { entity_id: entityId }
                )}
              />`
          : entity.state
      }
    </${ListCardRow}>`;
}
