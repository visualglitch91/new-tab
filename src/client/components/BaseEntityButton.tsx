import { CircularProgress, styled } from "@mui/joy";
import useAsyncChange from "../utils/useAsyncChange";
import { cx, uniqueClassName } from "../utils/styles";
import { BaseComponentGroupItem } from "../utils/typings";
import Icon from "./Icon";
import ButtonCard from "./ButtonCard";
import { useConfirm } from "../utils/useConfirm";

const classes = {
  wrapperActive: uniqueClassName(),
  wrapperCustomBG: uniqueClassName(),
};

const Wrapper = styled(ButtonCard)({
  height: "75px",
  display: "flex",
  flexDirection: "column",
  rowGap: "6px",
  boxSizing: "border-box",
  padding: "6px 8px",
  overflow: "hidden",

  [`&.${classes.wrapperActive}:not(.${classes.wrapperCustomBG})`]: {
    background: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  [`&.${classes.wrapperActive}.hover`]: {
    background: "rgba(255, 255, 255, 0.25)",
  },

  [`&.${classes.wrapperActive}.${classes.wrapperCustomBG}.hover`]: {
    background: "unset",
    filter: "brightness(1.1)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});

const Label = styled("div")({
  fontSize: "9px",
  fontWeight: "700",
  whiteSpace: "pre-wrap",
});

export default function BaseEntityButton({
  icon,
  label,
  disabled,
  checked,
  loading,
  color,
  changeTimeout = 0,
  confirmBefore,
  onPrimaryAction,
  onSecondaryAction,
  ...props
}: BaseComponentGroupItem) {
  const [confirm, modals] = useConfirm();

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  return (
    <>
      {modals}
      <Wrapper
        {...props}
        disabled={disabled}
        className={cx(
          color && !changing && classes.wrapperCustomBG,
          checked && !changing && classes.wrapperActive
        )}
        style={color && !changing ? { background: color } : undefined}
        onClick={() => {
          function onConfirm() {
            if (change() && onPrimaryAction) {
              onPrimaryAction();
            }
          }

          if (confirmBefore) {
            confirm({ title: "Continuar?", onConfirm });
          } else {
            onConfirm();
          }
        }}
        onLongPress={onSecondaryAction}
      >
        {loading || changing ? (
          <CircularProgress />
        ) : (
          <>
            <Icon icon={disabled ? "cancel" : icon || "cancel"} />
            <Label>{label}</Label>
          </>
        )}
      </Wrapper>
    </>
  );
}
