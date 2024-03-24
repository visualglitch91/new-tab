import { styled } from "@mui/material";
import CoverDominantColor from "./CoverDominantColor";

const Root = styled("div")({
  position: "relative",
  zIndex: 2,
  width: 105,
  height: 105,
  padding: 8,
  borderRadius: 6,
  overflow: "hidden",
  flexShrink: 0,

  "& img": {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 6,
  },
});

export default function Cover({ src }: { src: string }) {
  return (
    <Root>
      <CoverDominantColor src={src} brightness={2} />
      <img src={src} alt="" />
    </Root>
  );
}
