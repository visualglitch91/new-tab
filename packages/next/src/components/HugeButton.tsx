import { ButtonBase, alpha, styled } from "@mui/material";

export const borderRadius = "16px";

const ButtonCard = styled(ButtonBase)(({ theme }) => ({
  overflow: "hidden",
  transition: "all 100ms cubic-bezier(0.76, 0, 0.24, 1)",
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
  boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",

  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[800], 0.9),
  },

  "&:disabled": {
    opacity: 0.6,
    pointerEvents: "none",
  },
}));

export default ButtonCard;
