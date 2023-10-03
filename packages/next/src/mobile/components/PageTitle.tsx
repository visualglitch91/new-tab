import { styled } from "@mui/material";

const PageTile = styled("h1")({
  fontSize: 42,
  fontWeight: 600,
  margin: 0,
  transition: "font-size 200ms var(--tween)",
  willChange: "fontSize",
  transform: "translate3d(0px, 0px, 0px)",
  '[data-shrink="true"] &': {
    fontSize: 24,
  },
});

export default PageTile;
