import { styled } from "@mui/material";

const PageTile = styled("h1")({
  fontSize: 42,
  fontWeight: 600,
  margin: 0,
  transition: "font-size 70ms linear",
  willChange: "fontSize",
  transform: "translate3d(0px, 0px, 0px)",
  '[data-elevate="true"] &': {
    fontSize: 24,
  },
});

export default PageTile;
