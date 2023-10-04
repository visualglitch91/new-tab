import { styled } from "@mui/material";
import { SxProps } from "../theme/utils";
import { cx, sxx } from "../utils/styling";

const ImageIcon = styled("img")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const FontIcon = ImageIcon.withComponent("i");

export default function Icon({
  sx: _sx,
  className,
  icon,
  src,
  size = 24,
  style,
}: {
  sx?: SxProps;
  className?: string;
  icon?: string;
  src?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const sx = sxx(
    {
      fontSize: size,
      minWidth: size,
      minHeight: size,
      maxWidth: size,
      maxHeight: size,
    },
    _sx
  );

  if (src) {
    return (
      <ImageIcon
        sx={sx}
        style={style}
        className={cx(icon, className)}
        src={src}
        alt=""
      />
    );
  }

  if (!icon) {
    return null;
  }

  if (icon.startsWith("icofont-")) {
    return (
      <FontIcon
        sx={sx}
        style={style}
        className={cx("icofont", icon, className)}
      />
    );
  }

  const name =
    icon.startsWith("mdi:") || icon.startsWith("mdi-") ? icon.slice(4) : icon;

  return (
    <FontIcon
      sx={sx}
      style={style}
      className={cx("mdi", `mdi-${name}`, className)}
    />
  );
}
