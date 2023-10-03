import {
  ListItem as MuiListItem,
  ListItemText,
  ListItemIcon,
  SxProps,
  ListItemButton,
} from "@mui/material";
import Icon from "./Icon";

export default function ListItem({
  sx,
  icon,
  endSlot,
  startSlot,
  primaryText,
  secondaryText,
  onClick,
}: {
  sx?: SxProps;
  icon?: React.ReactNode;
  disabled?: boolean;
  endSlot?: React.ReactNode;
  startSlot?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <ListItemIcon>
        {startSlot || (typeof icon === "string" ? <Icon icon={icon} /> : icon)}
      </ListItemIcon>
      <ListItemText primary={primaryText} secondary={secondaryText} />
    </>
  );

  return (
    <MuiListItem sx={sx} secondaryAction={endSlot}>
      {onClick ? (
        <ListItemButton onClick={onClick}>{content}</ListItemButton>
      ) : (
        content
      )}
    </MuiListItem>
  );
}
