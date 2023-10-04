import { styled, Button } from "@mui/material";

export const Wrapper = styled("div")({
  display: "flex",

  "& > div:nth-child(1)": {
    flex: 1,
    background: "rgba(100, 100, 100, 0.5)",
  },

  "& > div:nth-child(2)": {
    height: "100vh",
    minWidth: 1440,
    display: "flex",
    flex: 3,
  },

  "& > div:nth-child(3)": {
    flex: 1,
  },
});

export const Tabs = styled("div")({
  background: "rgba(100, 100, 100, 0.5)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: 14,
  color: "white",
  padding: "24px 32px",
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
  height: 64,
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
