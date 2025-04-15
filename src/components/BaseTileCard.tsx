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
import { rgbStringToRGB, rgbToHSL } from "$app/utils/colors";
import { PaletteColors } from "$app/theme/palette";
import { usePageColor } from "$app/atoms/pageColor";
import Icon from "./Icon";

const enableBlur = !getConfig("disableBlurEffects");

const Root = styled(ButtonBase, {
  shouldForwardProp: (name) =>
    !["color", "active", "disableIconBackground"].includes(String(name)),
})<{
  color?: string;
  hoverColor?: PaletteColors;
  active?: boolean;
  disableIconBackground?: boolean;
}>(
  ({
    theme,
    color = "#FFFFFF",
    hoverColor,
    disabled,
    active: _active,
    disableIconBackground,
  }) => {
    const active = disabled ? false : _active;
    const background = theme.palette.base.dark;
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
      background,
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
      "body.mobile &": {
        background: alpha(background, 0.6),
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
        background: theme.palette.base.main,
        color: hoverColor && theme.palette[hoverColor].main,
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

  const [pageColor] = usePageColor();

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
      hoverColor={pageColor}
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
