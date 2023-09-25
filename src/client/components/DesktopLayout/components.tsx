import { styled } from "@mui/joy";
import { alpha } from "../../utils/styles";

export const Wrapper = styled("div")({
  height: "100%",
  display: "flex",
});

export const Tabs = styled("div")(({ theme }) => ({
  width: 96,
  backdropFilter: "blur(10px)",
  background: `linear-gradient(
      to bottom,
      ${alpha(theme.palette.background.body, 0.5)} 0%,
      ${alpha(theme.palette.background.body, 0.5)} 34%,
      ${theme.palette.background.body} 100%
    )`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: "14px",
  color: "white",
  padding: "24px 0",
  zIndex: 2,
}));

export const Content = styled("div")({
  width: "100%",
  padding: 16,
  overflow: "auto",
  overscrollBehavior: "contain",
  touchaction: "manipulation",
});

export const ContentInner = styled("div")({
  width: "100%",
  maxWidth: 1920,
  margin: "0 auto",
});
