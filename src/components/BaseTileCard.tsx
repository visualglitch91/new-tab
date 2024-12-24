import {
  alpha,
  Box,
  ButtonBase,
  darken,
  hexToRgb,
  IconButton,
  lighten,
  styled,
  Typography,
} from "@mui/material";
import { getConfig } from "$app/utils/useConfig";
import Icon from "./Icon";
import { rgbStringToRGB, rgbToHSL } from "$app/utils/colors";

const enableBlur = !getConfig("disableBlurEffects");

const Root = styled(ButtonBase, {
  shouldForwardProp: (name) =>
    !["color", "active", "disableIconBackground"].includes(String(name)),
})<{
  color?: string;
  active?: boolean;
  disableIconBackground?: boolean;
}>(
  ({
    theme,
    color = "#FFFFFF",
    disabled,
    active: _active,
    disableIconBackground,
  }) => {
    const active = disabled ? false : _active;
    const background = "rgb(28, 34, 48)";
    const iconBackground = disableIconBackground
      ? "#FFFFFF00"
      : active
      ? color
      : alpha(lighten(background, 0.3), 0.4);

    return {
      width: "100%",
      gap: theme.spacing(1),
      justifyContent: "flex-start",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.8, 1.2),
      background: alpha(background, 0.5),
      backdropFilter: enableBlur ? "blur(20px)" : undefined,
      boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
      opacity: disabled ? 0.5 : 1,
      "&, & .MuiIconButton-root": {
        transition: theme.transitions.create(["background", "opacity"]),
      },
      "& .MuiIconButton-root": {
        background: iconBackground,
        padding: disableIconBackground ? 0 : undefined,
        "& > *": {
          color: theme.palette.getContrastText(iconBackground),
        },
      },
      "& .MuiTypography-root": {
        margin: 0,
        lineHeight: 1,
      },
      "& .MuiTypography-body2": {
        fontWeight: 500,
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      },
      "&:not(:has(.MuiIconButton-root:hover)):hover": {
        background: alpha(background, 0.7),
        "& .MuiIconButton-root": {
          background: darken(iconBackground, 0.15),
        },
      },
      "& .MuiIconButton-root:hover": {
        opacity: active ? 1 : 0.9,
        background: darken(iconBackground, 0.2),
      },
    };
  }
);

export default function BaseTileCard({
  icon,
  active,
  disabled,
  color: _color,
  primaryText,
  secondaryText,
  endSlot,
  disableIconBackground,
  onClick,
  onIconClick,
}: {
  icon: string | React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  color?: string;
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
  endSlot?: React.ReactNode;
  disableIconBackground?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onIconClick?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  let color: string | undefined;

  const rgbString = _color?.startsWith("#")
    ? hexToRgb(_color)
    : _color?.startsWith("rgb")
    ? _color
    : undefined;

  if (rgbString) {
    const rgb = rgbStringToRGB(rgbString);
    const [hue, sat, light] = rgbToHSL(rgb);
    const isNeutral = sat < 8 || light < 5 || light > 90;

    color = isNeutral
      ? "#FFFFFF"
      : `hsl(${hue}deg, ${sat}%, ${Math.max(light, 60)}%)`;
  }

  return (
    <Root
      disabled={disabled}
      color={color}
      active={active}
      disableIconBackground={disableIconBackground}
      onClick={onClick}
    >
      <IconButton
        disabled={disabled}
        onClick={
          onIconClick
            ? (e) => {
                e.stopPropagation();
                onIconClick(e);
              }
            : undefined
        }
        onMouseDown={onIconClick ? (e) => e.stopPropagation() : undefined}
      >
        {typeof icon === "string" ? <Icon size={18} icon={icon} /> : icon}
      </IconButton>
      <Box
        flex={1}
        gap={0.2}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        overflow="hidden"
      >
        <Typography variant="body2">{primaryText}</Typography>
        {secondaryText && (
          <Typography variant="caption">{secondaryText}</Typography>
        )}
      </Box>
      {endSlot}
    </Root>
  );
}
