import { CircularProgress, SxProps, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import useAsyncChange from "../utils/useAsyncChange";
import { cx } from "../utils/styling";
import Icon from "./Icon";
import HugeButton from "./HugeButton";
import { useLongPress } from "@uidotdev/usehooks";

const classes = {
  wrapperActive: "BaseEntityButton--Active",
  wrapperCustomBG: "BaseEntityButton--CustomBG",
  horizontal: "BaseEntityButton--horizontal",
};

const Wrapper = styled(HugeButton)({
  "--iconSize": "24px",
  height: "82px",
  display: "flex",
  flexDirection: "column",
  rowGap: "6px",
  boxSizing: "border-box",
  padding: "6px 8px",
  overflow: "hidden",

  "& > i": {
    fontSize: `var(--iconSize) !important`,
    minWidth: `var(--iconSize) !important`,
    maxWidth: `var(--iconSize) !important`,
    minHeight: `var(--iconSize) !important`,
    maxHeight: `var(--iconSize) !important`,
  },

  [`&.${classes.wrapperActive}:not(.${classes.wrapperCustomBG})`]: {
    background: "rgba(255, 255, 255, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "#222",
  },

  [`&.${classes.wrapperActive}.hover`]: {
    background: "rgba(255, 255, 255, 0.25)",
  },

  [`&.${classes.wrapperActive}.${classes.wrapperCustomBG}.hover`]: {
    background: "unset",
    filter: "brightness(1.1)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  [`&.${classes.horizontal}`]: {
    "--iconSize": "22px",

    flexDirection: "row",
    justifyContent: "flex-start",
    height: "58px",
    padding: "18px 14px",

    "& > i + div": {
      fontSize: "12px",
      fontWeight: 600,
      textAlign: "left",
      marginLeft: "8px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

const Label = styled("div")({
  fontSize: "11px",
  fontWeight: "700",
  whiteSpace: "pre-wrap",
  display: "-webkit-box",
  "-webkit-line-clamp": "2",
  "-webkit-box-orient": "vertical",
});

export interface BaseEntityButtonProps {
  sx?: SxProps;
  label?: React.ReactNode;
  icon?: string | React.ReactNode;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  horizontal?: boolean;
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
  horizontal,
  changeTimeout = 0,
  confirmBefore,
  onClick,
  onLongPress = () => {},
  onHold,
  ...props
}: BaseEntityButtonProps) {
  const confirm = useConfirm();

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  const buttonProps = useLongPress(onLongPress);

  return (
    <Wrapper
      {...props}
      {...buttonProps}
      onClick={() => {
        (confirmBefore
          ? confirm({ title: "Continuar?" })
          : Promise.resolve()
        ).then(() => {
          if (change() && onClick) {
            onClick();
          }
        });
      }}
      sx={sx}
      disabled={disabled}
      className={cx(
        color && !changing && classes.wrapperCustomBG,
        checked && !changing && classes.wrapperActive,
        horizontal && !changing && classes.horizontal
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
