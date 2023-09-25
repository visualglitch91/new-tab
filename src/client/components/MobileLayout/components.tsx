import { styled } from "@mui/joy";
import { alpha } from "../../utils/styles";
import BorderButton from "../BorderButton";

export const Wrapper = styled("div")({
  height: "100%",
  overflow: "auto",
  overscrollBehavior: "contain",
  touchaction: "manipulation",
});

export const Tabs = styled("div")(({ theme }) => ({
  height: "60px",
  backdropFilter: "blur(10px)",
  background: `linear-gradient(
      to bottom,
      ${alpha(theme.palette.background.body, 0.57)} 0%,
      ${alpha(theme.palette.background.body, 0.57)} 34%,
      ${theme.palette.background.body} 100%
    )`,
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  display: "flex",
  rowGap: "14px",
  color: "white",
  padding: "0 14px",
  zIndex: 2,
  justifyContent: "space-between",
}));

export const Content = styled("div")({
  padding: "16px 16px 80px",
  ".statusbar-overlay &": { paddingTop: "48px" },
});

export const StatusBar = styled("div")(({ theme }) => ({
  ".statusbar-overlay &": {
    height: "32px",
    backdropFilter: "blur(10px)",
    background: alpha(theme.palette.background.body, 0.65),
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 2,
  },
}));

export const ExtraTab = styled(BorderButton)({
  paddingLeft: "16px",
  paddingRight: "16px",
  justifyContent: "flex-start",
  columnGap: "16px",
});
