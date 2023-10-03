import {
  styled,
  SxProps,
  ButtonBase,
  ListItemText,
  ListItemIcon,
  ListItem as MuiListItem,
} from "@mui/material";
import Icon from "./Icon";
import { sxx } from "../utils/styling";
import { useLongPress } from "@uidotdev/usehooks";

const customSx: SxProps = {
  paddingRight: "16px",
  alignItems: "stretch",
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
    transform: "unset",
    top: "unset",
    right: "unset",
    marginLeft: "8px",
    flexShrink: 0,

    "& button, & a, & .MuiSwitch-root": {
      position: "relative",
      zIndex: 2,
    },
  },
};

const ListButton = styled(ButtonBase)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

export default function ListItem({
  sx,
  icon,
  endSlot,
  startSlot,
  primaryText,
  secondaryText,
  onClick,
  onLongPress,
}: {
  sx?: SxProps;
  icon?: React.ReactNode;
  disabled?: boolean;
  endSlot?: React.ReactNode;
  startSlot?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
}) {
  const props = {
    sx: sxx(customSx, sx),
    secondaryAction: endSlot,
  };

  const hasInteraction = onClick || onLongPress;
  const buttonProps = useLongPress(onLongPress || (() => {}));

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

  if (hasInteraction) {
    return (
      <MuiListItem {...props}>
        <ListButton {...buttonProps} onClick={onClick} />
        {content}
      </MuiListItem>
    );
  }

  return <MuiListItem {...props}>{content}</MuiListItem>;
}
