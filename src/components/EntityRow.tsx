import { ComponentChildren } from "preact";
import { HassEntity } from "home-assistant-js-websocket";
import { useHass, getIcon, callService } from "../utils/hass";
import ListCardRow from "./ListCardRow";
import LightEntityDialog from "./LightEntityDialog";
import Switch from "./Switch";
import { renderModal } from "../utils/general";
import Icon from "./Icon";
import ColorBadge from "./ColorBadge";
import useAsyncChange from "../utils/useAsyncChange";
import DotLoading from "./DotLoading";

interface Props {
  icon?: string;
  label?: string;
  changeTimeout?: number;
  entityId: string;
  renderContent?: (entity: HassEntity) => ComponentChildren;
}

function BaseEntityRow({
  icon: customIcon,
  label,
  changeTimeout = 0,
  entity,
  entityId,
  renderContent,
}: Props & { entity: HassEntity }) {
  const icon = customIcon || getIcon(entity);

  function onLightClick() {
    renderModal((unmount) => (
      <LightEntityDialog title={label} entity={entity} onClose={unmount} />
    ));
  }

  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";
  const unavailable = state === "unavailable";

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  return (
    <ListCardRow
      disabled={unavailable}
      icon={icon}
      label={
        <>
          {label || friendlyName}
          {checked && attributes.rgb_color && (
            <ColorBadge size={12} color={attributes.rgb_color} />
          )}
        </>
      }
      onIconClick={domain === "light" && checked ? onLightClick : undefined}
    >
      {renderContent ? (
        renderContent(entity)
      ) : ["light", "switch", "input_boolean"].includes(domain) ? (
        unavailable ? (
          <Icon icon="cancel" />
        ) : changing ? (
          <DotLoading />
        ) : (
          <Switch
            checked={checked}
            onInput={() => {
              if (change()) {
                callService("homeassistant", checked ? "turn_off" : "turn_on", {
                  entity_id: entityId,
                });
              }
            }}
          />
        )
      ) : (
        entity.state
      )}
    </ListCardRow>
  );
}

export default function EntityRow(props: Props) {
  const { entityId, label } = props;
  const hass = useHass();
  const entity = hass.states[entityId];

  if (!entity) {
    return (
      <ListCardRow icon="cancel" label={entityId}>
        {label || entityId}
      </ListCardRow>
    );
  }

  return <BaseEntityRow {...props} entity={entity} />;
}
