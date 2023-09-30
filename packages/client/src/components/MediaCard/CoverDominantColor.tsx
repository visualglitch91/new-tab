import { styled } from "@mui/joy";

const Root = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const Inner = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
});

const Image = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundSize: "200% 200%",
  backgroundPosition: "center center",
});

export default function CoverDominantColor({
  src,
  blur = 60,
  brightness = 1,
  borderRadius = 0,
}: {
  src: string;
  className?: string;
  blur?: number;
  brightness?: number;
  borderRadius?: number;
}) {
  return (
    <Root style={{ borderRadius }}>
      <Inner>
        <Image
          sx={{
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px) brightness(${brightness})`,
          }}
        />
      </Inner>
    </Root>
  );
}
