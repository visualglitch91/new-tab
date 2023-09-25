import { styled } from "@mui/joy";
import RippleButton, { RippleButtonProps } from "./RippleButton";
import Paper from "./Paper";
import { alpha } from "../utils/styles";

export type ButtonCardProps = RippleButtonProps;

const ButtonCard = styled(Paper.withComponent(RippleButton))(({ theme }) => ({
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

  "&.hover": {
    backgroundColor: alpha(theme.palette.background.body, 0.7),
    boxShadow: "rgb(27, 55, 80) 3px 3px 13px -6px",
  },

  "&.disabled": {
    opacity: 0.6,
    pointerEvents: "none",
  },
}));

export default ButtonCard;
