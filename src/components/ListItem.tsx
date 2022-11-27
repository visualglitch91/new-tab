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
  clickableIconWrapper: uniqueClassName(),
};

const Wrapper = styled(
  "div",
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    column-gap: 12px;

    &.${classes.wrapperDisabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
);

const IconWrapper = styled(
  TouchButton,
  css`
    padding: 4px;
    background: transparent;
    border: none;
    font-size: 24px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &.${classes.clickableIconWrapper} {
      cursor: pointer;
      border-radius: 100%;
      transition: background 100ms linear;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
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
    <Wrapper className={cx(disabled && classes.wrapperDisabled)}>
      {icon && (
        <IconWrapper
          className={cx(hasInteraction && classes.clickableIconWrapper)}
          onTap={onSecondaryAction}
          onPress={onPress}
          onHold={onHold}
        >
          <Icon icon={icon} />
        </IconWrapper>
      )}
      <Label>
        {label}
        {color && <ColorBadge size={12} color={color} />}
      </Label>
      <div>{content}</div>
    </Wrapper>
  );
}
