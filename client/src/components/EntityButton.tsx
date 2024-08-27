import { SxProps } from "@mui/material";
import { getIcon, useEntity, callService } from "$client/utils/hass";
import { lightSupportsColor } from "$client/utils/light";
import { RGB } from "$client/utils/colors";
import {
  isColorEqual,
  getDisplayColor,
  getDisplayColorString,
} from "$client/utils/colors";
import useModal from "$client/utils/useModal";
import { useMenu } from "$client/utils/useMenu";
import BaseEntityButton from "./BaseEntityButton";
import LightEntityDialog from "./LightEntityDialog";

export interface EntityButtonProps {
  sx?: SxProps;
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  horizontal?: boolean;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
}

export default function EntityButton({
  sx,
  icon: customIcon,
  label: _label,
  horizontal,
  changeTimeout,
  entityId,
  confirmBefore,
  onClick,
  onLongPress,
}: EntityButtonProps) {
  const mount = useModal();
  const showMenu = useMenu();
  const entity = useEntity(entityId);

  if (!entity) {
    return <BaseEntityButton sx={sx} disabled label={_label || entityId} />;
  }

  const icon = customIcon || getIcon(entity);
  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");

  const checked =
    domain === "cover" ? attributes.raw_state === "open" : state === "on";

  const unavailable = state === "unavailable";

  const label =
    _label || friendlyName?.replace(/\[[^()]*\]/g, "").trim() || entityId;

  const displayColor =
    domain === "light" &&
    lightSupportsColor(entity) &&
    Array.isArray(attributes.rgb_color)
      ? getDisplayColor(attributes.rgb_color as RGB)
      : attributes.color_mode === "color_temp"
      ? attributes.color_temp >
        (attributes.max_mireds + attributes.min_mireds) / 2
        ? ([255, 168, 66] as RGB)
        : ([255, 255, 255] as RGB)
      : undefined;

  const isWhite = displayColor
    ? isColorEqual(displayColor, [255, 255, 255])
    : false;

  function onLightDetails() {
    mount((_, dialogProps) => (
      <LightEntityDialog
        title={label}
        entityId={entity!.entity_id}
        {...dialogProps}
      />
    ));
  }

  function defaultOnLongPress() {
    if (domain === "light") {
      onLightDetails();
      return;
    }

    const groupedIds: undefined | string | string[] =
      entity?.attributes.entity_id;

    if (Array.isArray(groupedIds) && groupedIds.length > 0) {
      return;
    }
  }

  function defaultOnClick(e: React.MouseEvent<HTMLElement>) {
    if (domain === "cover") {
      showMenu({
        mouseEvent: e.nativeEvent,
        clickAnchor: true,
        title: String(label),
        options: [
          {
            label: "Abrir",
            onClick: () =>
              callService("cover", "open_cover", { entity_id: entityId }),
          },
          {
            label: "Fechar",
            onClick: () =>
              callService("cover", "close_cover", { entity_id: entityId }),
          },
        ],
      });
    } else {
      callService(
        domain === "button" ? "button" : "homeassistant",
        domain === "button" ? "press" : checked ? "turn_off" : "turn_on",
        { entity_id: entityId }
      );
    }
  }

  return (
    <BaseEntityButton
      sx={sx}
      checked={checked}
      disabled={unavailable}
      horizontal={horizontal}
      icon={icon}
      label={label}
      changeTimeout={changeTimeout}
      color={
        displayColor && !isWhite
          ? getDisplayColorString(displayColor, 0.6)
          : undefined
      }
      confirmBefore={confirmBefore}
      onClick={onClick || defaultOnClick}
      onLongPress={onLongPress || defaultOnLongPress}
    />
  );
}
