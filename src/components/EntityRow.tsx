import { ComponentChildren, render } from "preact";
import { HassEntity } from "home-assistant-js-websocket";
import { useHass, getIcon, makeServiceCall } from "../utils/hass";
import ListCardRow from "./ListCardRow";
import LightDialog from "./LightDialog";
import Switch from "./Switch";

export default function EntityRow({
  icon: customIcon,
  label,
  entityId,
  renderContent,
}: {
  icon?: string;
  label?: string;
  entityId: string;
  renderContent?: (entity: HassEntity) => ComponentChildren;
}) {
  const hass = useHass();

  const entity = hass.states[entityId];
  const icon = customIcon || entity?.attributes?.icon || getIcon(entity);

  if (!entity) {
    return (
      <ListCardRow icon={icon} label={entityId}>
        unavailable
      </ListCardRow>
    );
  }

  function onLightClick() {
    const dialog = document.createElement("div");
    document.body.appendChild(dialog);

    render(
      <LightDialog
        title={label}
        entity={entity}
        onDone={() => {
          render(null, dialog);
          dialog.remove();
        }}
      />,
      dialog
    );
  }

  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";

  return (
    <ListCardRow
      icon={icon}
      label={label || friendlyName}
      onIconClick={domain === "light" ? onLightClick : undefined}
    >
      {renderContent ? (
        renderContent(entity)
      ) : ["light", "switch", "input_boolean"].includes(domain) ? (
        <Switch
          checked={checked}
          onInput={makeServiceCall(
            "homeassistant",
            checked ? "turn_off" : "turn_on",
            { entity_id: entityId }
          )}
        />
      ) : (
        entity.state
      )}
    </ListCardRow>
  );
}
