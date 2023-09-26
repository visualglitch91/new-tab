import { HassEntity } from "home-assistant-js-websocket";
import { useEntity, getIcon, makeServiceCall } from "../utils/hass";
import useModal from "../utils/useModal";
import { rgbToHex } from "../utils/general";
import Button from "./Button";
import ListItem from "./ListItem";
import LightEntityDialog from "./LightEntityDialog";
import { useConfirm } from "../utils/useConfirm";

interface Props {
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: boolean;
  renderListContent?: (entity: HassEntity) => React.ReactNode;
}

function BaseEntityListItem({
  icon: customIcon,
  label: _label,
  changeTimeout = 0,
  confirmBefore,
  entity,
  entityId,
  renderListContent,
}: Props & { entity: HassEntity }) {
  const icon = customIcon || getIcon(entity);
  const [mount, modals] = useModal();
  const [confirm, confirmModals] = useConfirm();

  function onLightClick() {
    mount((unmount) => (
      <LightEntityDialog
        title={label}
        entityId={entity.entity_id}
        onClose={unmount}
      />
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

  const customProps = renderListContent
    ? { children: renderListContent(entity) }
    : ["light", "switch", "input_boolean"].includes(domain)
    ? {
        checked,
        changeTimeout,
        onPrimaryAction,
      }
    : domain === "script"
    ? {
        children: (
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
    : { children: entity.state };

  return (
    <>
      {modals}
      {confirmModals}
      <ListItem
        disabled={unavailable}
        icon={icon}
        label={label}
        color={attributes.rgb_color && rgbToHex(attributes.rgb_color)}
        onSecondaryAction={
          domain === "light" && checked ? onLightClick : undefined
        }
        {...customProps}
      />
    </>
  );
}

export default function EntityListItem(props: Props) {
  const { entityId, label } = props;
  const entity = useEntity(entityId);

  if (!entity) {
    return (
      <ListItem disabled icon="cancel" label={entityId}>
        {label || entityId}
      </ListItem>
    );
  }

  return <BaseEntityListItem {...props} entity={entity} />;
}
