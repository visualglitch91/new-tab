import { styled } from "@mui/joy";
import RippleButton from "../RippleButton";

export const Wrapper = styled("div")({
  height: "100%",
  maxWidth: 1440,
  display: "flex",
  margin: "0 auto",
});

export const Tabs = styled("div")({
  borderRight: "1px solid rgba(10, 10, 10, 0.3)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: "14px",
  color: "white",
  padding: "24px 12px",
  zIndex: 2,
});

export const Content = styled("div")({
  width: "100%",
  padding: 16,
  overflow: "auto",
  overscrollBehavior: "contain",
  touchaction: "manipulation",
});

export const TabRoot = styled(RippleButton)({
  margin: 0,
  padding: "0 18px",
  border: "none",
  borderRadius: 16,
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "inherit",
  display: "flex",
  flexDirection: "row",
  columnGap: "12px",
  alignItems: "center",
  justifyContent: "flex-start",
  cursor: "pointer",
  height: 64,
  fontWeight: "bolder",
  transition: "all 80ms cubic-bezier(0.76, 0, 0.24, 1)",
  "& > i": { fontSize: "26px" },
  "&:hover": { background: "rgba(10, 10, 10, 0.2)" },
  "&.active": { background: "rgba(10, 10, 10, 0.3)" },
  "&:hover.active": { background: "rgba(10, 10, 10, 0.4)" },
});

export const TabTitle = styled("span")({
  marginTop: 1,
  whiteSpace: "nowrap",
});
