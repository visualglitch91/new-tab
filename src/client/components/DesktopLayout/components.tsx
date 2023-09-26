import { styled } from "@mui/joy";

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
