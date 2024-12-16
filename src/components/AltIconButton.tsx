import { Button, ButtonProps } from "@mui/material";
import { sxx } from "$app/utils/styling";
import Icon from "./Icon";

export default function AltIconButton({
  size = 32,
  iconSize,
  icon,
  disabled,
  color = "glossy",
  sx,
  onClick,
}: {
  size?: number;
  iconSize?: number;
  icon: string;
  disabled?: boolean;
  color?: ButtonProps["color"];
  sx?: ButtonProps["sx"];
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Button
      disableElevation
      size="small"
      variant="contained"
      sx={sxx(
        {
          borderRadius: "100%",
          minWidth: "var(--size)",
          maxWidth: "var(--size)",
          minHeight: "var(--size)",
          maxHeight: "var(--size)",
          "--size": `${size}px`,
          "&[disabled]": { opacity: 0.4 },
        },
        sx
      )}
      color={color}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon icon={icon} size={iconSize || Math.max(size * 0.6, 16)} />
    </Button>
  );
}
