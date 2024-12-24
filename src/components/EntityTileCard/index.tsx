import { getIcon, useEntity } from "$app/utils/hass";
import useModal from "$app/utils/useModal";
import { useMenu } from "$app/utils/useMenu";
import useConfirm from "$app/utils/useConfirm";
import BaseTileCard from "../BaseTileCard";
import getSwitchProps from "./getSwitchProps";
import getButtonProps from "./getButtonProps";
import getCoverProps from "./getCoverProps";
import getLightProps from "./getLightProps";
import getSelectProps from "./getSelectProps";

export interface EntityTileCardProps {
  icon?: string;
  label?: string;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: "on" | "off" | "toggle";
}

const propFactoryByDomain = {
  switch: getSwitchProps,
  button: getButtonProps,
  cover: getCoverProps,
  light: getLightProps,
  select: getSelectProps,
  input_boolean: getSwitchProps,
  input_button: getButtonProps,
};

export default function EntityTileCard({
  icon: customIcon,
  label: _label,
  entityId,
  confirmBefore,
}: EntityTileCardProps) {
  const mount = useModal();
  const showMenu = useMenu();
  const confirm = useConfirm();
  const entity = useEntity(entityId);

  const icon = customIcon || (entity && getIcon(entity));
  const { state, attributes } = entity || {};
  const { friendly_name: friendlyName } = attributes || {};
  const [domain] = entityId.split(".");
  const unavailable = state === "unavailable";

  const label =
    _label || friendlyName?.replace(/\[[^()]*\]/g, "").trim() || entityId;

  if (!entity || !attributes) {
    return (
      <BaseTileCard disabled icon="cancel" primaryText={_label || entityId} />
    );
  }

  const props = (propFactoryByDomain[domain] || (() => ({})))({
    label,
    entity,
    mount,
    confirm,
    showMenu,
    confirmBefore,
  });

  return (
    <BaseTileCard
      icon={icon}
      active={state === "on"}
      primaryText={label}
      disabled={unavailable}
      {...props}
    />
  );
}
