import useAsyncChange from "../utils/useAsyncChange";
import { cx, css, styled, uniqueClassName } from "../styling";
import Icon from "./Icon";
import CircularLoading from "./CircularLoading";
import { BaseComponentGroupItem } from "../utils/typings";
import ButtonCard from "./ButtonCard";

const classes = {
  wrapperActive: uniqueClassName(),
  wrapperCustomBG: uniqueClassName(),
};

const Wrapper = styled(
  ButtonCard,
  css`
    height: 75px;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    box-sizing: border-box;
    padding: 6px 8px;
    overflow: hidden;

    &.${classes.wrapperActive}:not(.${classes.wrapperCustomBG}) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &.${classes.wrapperActive}.hover {
      background: rgba(255, 255, 255, 0.25);
    }

    &.${classes.wrapperActive}.${classes.wrapperCustomBG}.hover {
      background: unset;
      filter: brightness(1.1);
      border-color: rgba(255, 255, 255, 0.1);
    }
  `
);

const Label = styled(
  "div",
  css`
    font-size: 9px;
    font-weight: 700;
    white-space: pre-wrap;
  `
);

export default function BaseEntityButton({
  icon,
  label,
  disabled,
  checked,
  color,
  changeTimeout = 0,
  onPrimaryAction,
  onSecondaryAction,
  ...props
}: BaseComponentGroupItem) {
  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  return (
    <Wrapper
      {...props}
      disabled={disabled}
      className={cx(
        color && !changing && classes.wrapperCustomBG,
        checked && !changing && classes.wrapperActive
      )}
      style={color && !changing ? { backgroundColor: color } : undefined}
      onTap={() => {
        if (change() && onPrimaryAction) {
          onPrimaryAction();
        }
      }}
      onDoubleTap={onSecondaryAction}
    >
      {changing ? (
        <CircularLoading />
      ) : (
        <>
          <Icon icon={disabled ? "cancel" : icon || "cancel"} />
          <Label>{label}</Label>
        </>
      )}
    </Wrapper>
  );
}
