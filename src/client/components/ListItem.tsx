import { styled } from "@mui/joy";
import { BaseComponentGroupItem } from "../utils/typings";
import useAsyncChange from "../utils/useAsyncChange";
import { cx } from "../utils/styles";
import ColorBadge from "./ColorBadge";
import DotLoading from "./DotLoading";
import Icon from "./Icon";
import Switch from "./Switch";
import RippleButton from "./RippleButton";

const classes = {
  wrapperDisabled: "LitemItem__Root--wrapperDisabled",
  clickableLabel: "LitemItem__Root--clickableLabel",
};

const Root = styled("div")({
  position: "relative",
  padding: "0 8px",
  margin: "0 -8px",
  borderRadius: "10px",
  overflow: "hidden",

  [`&.${classes.wrapperDisabled}`]: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  [`&.${classes.clickableLabel}:not(.${classes.wrapperDisabled})`]: {
    cursor: "pointer",
    transition: "background 100ms linear",
    "&:hover": { background: "rgba(0, 0, 0, 0.1)" },
  },
});

const BackgroundButtonWrapper = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,

  "& > button": {
    background: "transparent",
    border: "none",
    width: "100%",
    height: "100%",
  },

  [`.${classes.clickableLabel}:not(.${classes.wrapperDisabled}) &`]: {
    cursor: "pointer",
  },
});

const InnerWrapper = styled("div")({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  columnGap: "12px",
  color: "white",
  zIndex: 2,
  position: "relative",
  pointerEvents: "none",
  "& button, & label": { pointerEvents: "all" },
});

const LabelIcon = styled(Icon)({
  fontSize: "24px",
  minWidth: "40px",
  maxWidth: "40px",
  height: "40px",
});

const Label = styled("div")({
  marginRight: "auto",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  columnGap: "8px",
  flexShrink: 0,
});

const Content = styled("div")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export default function ListItem({
  label,
  icon,
  color,
  disabled,
  checked,
  changeTimeout = 0,
  children,
  renderListContent,
  onPrimaryAction = () => {},
  onSecondaryAction,
  onLongPress,
  onHold,
}: BaseComponentGroupItem & {
  children?: React.ReactNode;
  renderListContent?: () => React.ReactNode;
}) {
  const hasInteraction = Boolean(onLongPress || onHold || onSecondaryAction);

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  const content = renderListContent ? (
    renderListContent()
  ) : children ? (
    children
  ) : typeof checked === "boolean" ? (
    disabled ? (
      <Icon icon="cancel" />
    ) : changing ? (
      <DotLoading />
    ) : (
      <Switch
        checked={checked}
        onChange={() => {
          if (change()) {
            onPrimaryAction();
          }
        }}
      />
    )
  ) : null;

  return (
    <Root
      className={cx(
        disabled && classes.wrapperDisabled,
        hasInteraction && classes.clickableLabel
      )}
    >
      <BackgroundButtonWrapper>
        <RippleButton
          onClick={onSecondaryAction}
          onLongPress={onLongPress}
          onHold={onHold}
        />
      </BackgroundButtonWrapper>
      <InnerWrapper>
        {typeof icon === "string" ? <LabelIcon icon={icon} /> : icon}
        <Label>
          {label}
          {color && <ColorBadge size={12} color={color} />}
        </Label>
        <Content>{content}</Content>
      </InnerWrapper>
    </Root>
  );
}
