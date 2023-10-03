import { styled } from "@mui/material";

const PageTile = styled("h1")({
  fontSize: 42,
  fontWeight: 600,
  margin: 0,
  transition: `
    transform 200ms var(--tween),
    margin 200ms var(--tween),
    font-size 200ms var(--tween)
  `,
  '[data-shrink="true"] &': {
    fontSize: 24,
    marginTop: -1,
    transform: "translateX(42px)",
  },
});

export default PageTile;
