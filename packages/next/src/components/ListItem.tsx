import {
  ListItem as MuiListItem,
  ListItemText,
  ListItemIcon,
  SxProps,
  ListItemButton,
} from "@mui/material";
import Icon from "./Icon";
import { sxx } from "../utils/styling";

const customSx: SxProps = {
  paddingRight: "16px",
  "& .MuiListItemText-primary, & .MuiListItemText-secondary": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .MuiListItemSecondaryAction-root": {
    position: "initial",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    transform: "unset",
    top: "unset",
    right: "unset",
    marginLeft: "8px",
  },
};

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
      {(startSlot || icon) && (
        <ListItemIcon>
          {startSlot ||
            (typeof icon === "string" ? <Icon icon={icon} /> : icon)}
        </ListItemIcon>
      )}
      <ListItemText primary={primaryText} secondary={secondaryText} />
    </>
  );

  return (
    <MuiListItem sx={sxx(customSx, sx)} secondaryAction={endSlot}>
      {onClick ? (
        <ListItemButton onClick={onClick}>{content}</ListItemButton>
      ) : (
        content
      )}
    </MuiListItem>
  );
}
