import { styled, css, uniqueClassName, cx } from "../styling";
import { BaseComponentGroupItem } from "../utils/typings";
import useAsyncChange from "../utils/useAsyncChange";
import ColorBadge from "./ColorBadge";
import DotLoading from "./DotLoading";
import Icon from "./Icon";
import Switch from "./Switch";
import TouchButton from "./TouchButton";

const classes = {
  wrapperDisabled: uniqueClassName(),
  clickableLabel: uniqueClassName(),
};

const Root = styled(
  "div",
  css`
    position: relative;
    padding: 0 8px;
    margin: 0 -8px;
    border-radius: 10px;
    overflow: hidden;

    &.${classes.wrapperDisabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.${classes.clickableLabel}:not(.${classes.wrapperDisabled}) {
      cursor: pointer;
      transition: background 100ms linear;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  `
);

const BackgroundButtonWrapper = styled(
  "div",
  css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    & > button {
      background: transparent;
      border: none;
      width: 100%;
      height: 100%;
    }

    .${classes.clickableLabel}:not(.${classes.wrapperDisabled}) & {
      cursor: pointer;
    }
  `
);

const InnerWrapper = styled(
  "div",
  css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    column-gap: 12px;
    color: white;
    z-index: 2;
    position: relative;
    pointer-events: none;

    & button,
    & label {
      pointer-events: all;
    }
  `
);

const LabelIcon = styled(
  Icon,
  css`
    font-size: 24px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
  `
);

const Label = styled(
  "div",
  css`
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    column-gap: 8px;
  `
);

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
  onPress,
  onHold,
}: BaseComponentGroupItem & {
  children?: React.ReactNode;
  renderListContent?: () => React.ReactNode;
}) {
  const hasInteraction = Boolean(onPress || onHold || onSecondaryAction);

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
        onInput={() => {
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
        <TouchButton
          onTap={onSecondaryAction}
          onPress={onPress}
          onHold={onHold}
        />
      </BackgroundButtonWrapper>
      <InnerWrapper>
        {icon && <LabelIcon icon={icon} />}
        <Label>
          {label}
          {color && <ColorBadge size={12} color={color} />}
        </Label>
        <div>{content}</div>
      </InnerWrapper>
    </Root>
  );
}
