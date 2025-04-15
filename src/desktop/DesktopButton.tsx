import { ButtonBase, ButtonBaseProps, styled } from "@mui/material";
import Icon from "$app/components/Icon";
import { usePageColor } from "$app/atoms/pageColor";
import { PaletteColors } from "$app/theme/palette";

const Root = styled(ButtonBase)<{ color?: PaletteColors }>(
  ({ theme, color = "green" }) => ({
    borderRadius: 6,
    textTransform: "lowercase",
    fontWeight: 500,
    backgroundColor: theme.palette.base.dark,
    padding: theme.spacing(1, 1.5),
    gap: theme.spacing(0.8),
    "&:hover": {
      backgroundColor: theme.palette.base.main,
      color: theme.palette[color].main,
    },
  })
);

export default function DesktopButton<C extends React.ElementType = "button">({
  icon,
  color,
  children,
  ...props
}: ButtonBaseProps<C> & {
  icon?: string;
  component?: C;
  color?: PaletteColors;
}) {
  const [pageColor] = usePageColor();

  return (
    <Root {...props} color={pageColor}>
      {icon && <Icon size={18} icon={icon} color={color} />}
      <span>{children}</span>
    </Root>
  );
}
