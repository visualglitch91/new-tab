import { CircularProgress, SxProps, styled } from "@mui/material";
import { useLongPress } from "@uidotdev/usehooks";
import useAsyncChange from "$client/utils/useAsyncChange";
import { cx } from "$client/utils/styling";
import useConfirm from "$client/utils/useConfirm";
import Icon from "./Icon";
import HugeButton from "./HugeButton";

const classes = {
  wrapperActive: "BaseEntityButton__Active",
  wrapperCustomBG: "BaseEntityButton__CustomBG",
  horizontal: "BaseEntityButton__horizontal",
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
    background: "rgba(255, 255, 255, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "#222",
  },

  [`&.${classes.wrapperActive}:hover`]: {
    background: "rgba(255, 255, 255, 0.6)",
  },

  [`&.${classes.wrapperActive}.${classes.wrapperCustomBG}:hover`]: {
    background: "unset",
    filter: "brightness(1.2)",
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

      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",

      "@supports (-webkit-line-clamp: 2)": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "initial",
        display: "-webkit-box",
        WebkitLineClamp: "2",
        WebkitBoxOrient: "vertical",
      },
    },
  },
});

const Label = styled("div")({
  fontSize: "11px",
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
  horizontal?: boolean;
  changeTimeout?: number;
  hiddenOnDesktop?: boolean;
  confirmBefore?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
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
      onClick={(e) => {
        const run = () => {
          if (change() && onClick) {
            onClick(e);
          }
        };

        if (confirmBefore) {
          confirm({ title: "Continuar?", onConfirm: run });
        } else {
          run();
        }
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
        <CircularProgress size={horizontal ? 18 : 24} sx={{ mx: "auto" }} />
      ) : (
        <>
          {typeof icon === "string" ? (
            <Icon icon={disabled ? "cancel" : icon || "cancel"} />
          ) : (
            icon
          )}
          <Label>{label}</Label>
        </>
      )}
    </Wrapper>
  );
}
