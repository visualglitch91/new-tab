import { styled } from "@mui/joy";
import RippleButton from "./RippleButton";

const Button = styled(RippleButton)(({ theme }) => ({
  height: "100%",
  margin: 0,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: theme.palette.primary[400],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background 60ms linear, box-shadow 60ms linear",
  fontWeight: "bolder",
  textTransform: "uppercase",
  padding: "6px 8px",
  borderRadius: "4px",
  "&.hover": { background: "rgba(0, 0, 0, 0.1)" },
}));

export default Button;
