import { ButtonBase, styled } from "@mui/material";
import { getConfig } from "$client/utils/useConfig";

const enableBlur = !getConfig("disableBlurEffects");

const ButtonCard = styled(ButtonBase)({
  overflow: "hidden",
  transition: "all 100ms var(--tween)",
  height: "100%",
  margin: 0,
  padding: "6px",
  outline: "none",
  fontSize: "17px",
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  tapHighlightColor: "transparent",
  boxSizing: "border-box",
  border: "1px solid transparent",
  borderRadius: 22,
  flexDirection: "column",
  backgroundColor: "rgba(28, 34, 48,0.5)",
  boxShadow: `
    0px 3px 1px -2px rgba(0,0,0,0.2),
    0px 2px 2px 0px rgba(0,0,0,0.14),
    0px 1px 5px 0px rgba(0,0,0,0.12)
  `,

  backdropFilter: enableBlur ? "blur(20px)" : undefined,

  "&:hover": {
    backgroundColor: "rgba(20, 20, 20, 0.6)",
  },

  "&:disabled": {
    opacity: 0.6,
    pointerEvents: "none",
  },
});

export default ButtonCard;
