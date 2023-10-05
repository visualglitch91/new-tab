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
  flexShrink: 0,

  "& .MuiListItemText-root": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

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

const sizesSx = {
  sm: { minHeight: "42px", paddingTop: "5px", paddingBottom: "5px" },
  md: { minHeight: "48px" },
  lg: { minHeight: "54px" },
};

const ListButton = styled(ButtonBase)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

const interactionSx: SxProps = {
  transition: "backgroundColor 100ms var(--tween)",
  "&:hover": {
    backgroundColor: "rgba(20, 20, 20, 0.2)",
  },
};

export default function ListItem({
  sx,
  icon,
  endSlot,
  minSize = "md",
  startSlot,
  primaryText,
  secondaryText,
  onClick,
  onLongPress,
}: {
  sx?: SxProps;
  minSize?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
  endSlot?: React.ReactNode;
  startSlot?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
}) {
  const hasInteraction = onClick || onLongPress;
  const buttonProps = useLongPress(onLongPress || (() => {}));

  const props = {
    sx: sxx(customSx, sizesSx[minSize], hasInteraction && interactionSx, sx),
    secondaryAction: endSlot,
  };

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
