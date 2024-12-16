import { styled, Button } from "@mui/material";
import GlossyPaper from "$app/components/GlossyPaper";

export const Tabs = styled(GlossyPaper)({
  marginTop: 24,
  display: "flex",
  flexDirection: "column",
  rowGap: 14,
  color: "white",
  padding: 24,
  zIndex: 2,
});

export const Content = styled("div")({
  width: "100%",
  padding: "24px 32px",
  overflow: "auto",
  overscrollBehavior: "contain",
  touchaction: "manipulation",
});

export const TabRoot = styled(Button)({
  justifyContent: "flex-start",
  textTransform: "none",
  padding: "8px 22px",
  width: "240px",
  fontWeight: 600,
  fontSize: "16px",
});

TabRoot.defaultProps = {
  size: "large",
  color: "white",
  variant: "text",
  fullWidth: true,
};

export const TabTitle = styled("span")({
  marginTop: 1,
  whiteSpace: "nowrap",
});
