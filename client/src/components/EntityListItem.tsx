import { HassEntity } from "home-assistant-js-websocket";
import { SxProps, Button, Switch } from "@mui/material";
import { useEntity, getIcon, makeServiceCall } from "$client/utils/hass";
import useModal from "$client/utils/useModal";
import { rgbToHex } from "$client/utils/colors";
import useAsyncChange from "$client/utils/useAsyncChange";
import useConfirm from "$client/utils/useConfirm";
import ListItem from "./ListItem";
import LightEntityDialog from "./LightEntityDialog";
import ColorBadge from "./ColorBadge";
import Icon from "./Icon";
import DotLoading from "./DotLoading";

export interface EntityListItemProps {
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: boolean;
  sx?: SxProps;
  renderListContent?: (entity: HassEntity) => React.ReactNode;
}

function BaseEntityListItem({
  sx,
  icon: customIcon,
  label: _label,
  changeTimeout = 0,
  confirmBefore,
  entity,
  entityId,
  renderListContent,
}: EntityListItemProps & { entity: HassEntity }) {
  const icon = customIcon || getIcon(entity);
  const mount = useModal();
  const confirm = useConfirm();

  function onLightClick() {
    mount((_, props) => (
      <LightEntityDialog title={label} entityId={entity.entity_id} {...props} />
    ));
  }

  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";
  const unavailable = state === "unavailable";

  const label =
    _label || friendlyName?.replace(/\[[^()]*\]/g, "").trim() || entityId;

  const onPrimaryAction = makeServiceCall(
    "homeassistant",
    checked ? "turn_off" : "turn_on",
    { entity_id: entityId }
  );

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  const customProps = renderListContent
    ? { endSlot: renderListContent(entity) }
    : ["light", "switch", "input_boolean"].includes(domain)
    ? {
        endSlot:
          typeof checked === "boolean" ? (
            unavailable ? (
              <Icon icon="cancel" />
            ) : changing ? (
              <DotLoading />
            ) : (
              <Switch
                checked={checked}
                onChange={() => {
                  if (change()) {
                    onPrimaryAction();
                  }
                }}
              />
            )
          ) : null,
      }
    : domain === "script"
    ? {
        endSlot: (
          <Button
            onClick={
              onPrimaryAction
                ? () => {
                    if (confirmBefore) {
                      confirm({
                        title: "Continuar?",
                        onConfirm: onPrimaryAction,
                      });
                    } else {
                      onPrimaryAction();
                    }
                  }
                : undefined
            }
          >
            Executar
          </Button>
        ),
      }
    : { endSlot: entity.state };

  const colorBadge = attributes.rgb_color && rgbToHex(attributes.rgb_color);

  return (
    <ListItem
      sx={sx}
      disabled={unavailable}
      icon={icon}
      primaryText={
        colorBadge ? (
          <>
            {label}
            <ColorBadge size={12} color={colorBadge} />
          </>
        ) : (
          label
        )
      }
      onClick={domain === "light" && checked ? onLightClick : undefined}
      {...customProps}
    />
  );
}

export function EntityListItems({ items }: { items: EntityListItemProps[] }) {
  return (
    <>
      {items.map((props, index) => (
        <EntityListItem key={index} {...props} />
      ))}
    </>
  );
}

export default function EntityListItem(props: EntityListItemProps) {
  const { entityId, label } = props;
  const entity = useEntity(entityId);

  if (!entity) {
    return (
      <ListItem
        disabled
        icon="cancel"
        primaryText={entityId}
        endSlot={label || entityId}
      />
    );
  }

  return <BaseEntityListItem {...props} entity={entity} />;
}
