import { CircularProgress, SxProps, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import useAsyncChange from "../utils/useAsyncChange";
import { cx } from "../utils/styling";
import Icon from "./Icon";
import HugeButton from "./HugeButton";
import useLongPress from "../utils/useLongPress";

const classes = {
  wrapperActive: "BaseEntityButton--Active",
  wrapperCustomBG: "BaseEntityButton--CustomBG",
};

const Wrapper = styled(HugeButton)({
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

export interface BaseEntityButtonProps {
  sx?: SxProps;
  label?: React.ReactNode;
  icon?: string | React.ReactNode;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  changeTimeout?: number;
  hiddenOnDesktop?: boolean;
  confirmBefore?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  onHold?: () => void;
}

export default function BaseEntityButton({
  sx,
  icon,
  label,
  disabled,
  checked,
  loading,
  color,
  changeTimeout = 0,
  confirmBefore,
  onClick,
  onLongPress,
  onHold,
  ...props
}: BaseEntityButtonProps) {
  const confirm = useConfirm();

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  const buttonProps = useLongPress({
    onClick: () => {
      (confirmBefore
        ? confirm({ title: "Continuar?" })
        : Promise.resolve()
      ).then(() => {
        if (change() && onClick) {
          onClick();
        }
      });
    },
    onLongPress,
    onHold,
  });

  return (
    <Wrapper
      {...props}
      {...buttonProps}
      sx={sx}
      disabled={disabled}
      className={cx(
        color && !changing && classes.wrapperCustomBG,
        checked && !changing && classes.wrapperActive
      )}
      style={color && !changing ? { background: color } : undefined}
    >
      {loading || changing ? (
        <CircularProgress />
      ) : (
        <>
          {typeof icon === "string" && (
            <Icon icon={disabled ? "cancel" : icon || "cancel"} />
          )}
          <Label>{label}</Label>
        </>
      )}
    </Wrapper>
  );
}
