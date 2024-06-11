import { CircularProgress, Box, styled } from "@mui/material";
import GlossyPaper from "../GlossyPaper";
import { useEntity } from "$client/utils/hass";
import { useCurrentMedia } from "./utils";
import Controls from "./Controls";
import Cover from "./Cover";
import CoverDominantColor from "./CoverDominantColor";

const Root = styled(GlossyPaper)({
  position: "relative",
  textAlign: "left",
  overflow: "hidden",
  padding: 12,
});

const Inner = styled("div")({
  position: "relative",
  zIndex: 2,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

const Info = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  rowGap: 4,
  overflow: "hidden",
  flex: 1,
});

const ellipsis = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
} as const;

const Title = styled("div")({
  ...ellipsis,
  fontSize: 20,
  fontWeight: 700,
});

const Artist = styled("div")({
  ...ellipsis,
  fontSize: 16,
});

const Album = styled("div")({
  ...ellipsis,
  fontSize: 14,
  opacity: 0.7,
});

const SpotifyControlWrapper = styled("div")({
  margin: "0 -12px -12px",
  padding: 12,
  background: "rgba(50,50,50,0.2)",
});

export default function MediaCard() {
  const media = useCurrentMedia();
  const miboxLoading = useEntity("script.sala_mibox_ligar")?.state === "on";
  const isSpotify = !!media?.spotify;

  if (!media || miboxLoading) {
    return (
      <Root
        sx={{
          height: 129,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {miboxLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Title>Televisão</Title>
            <Artist>Nada tocando no momento</Artist>
          </>
        )}
      </Root>
    );
  }

  return (
    <Root>
      <Inner>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
          <Cover src={media.image} />
          <Info sx={isSpotify ? {} : { justifyContent: "center" }}>
            <Title>{media.title}</Title>
            {isSpotify ? (
              <>
                <Artist>{media.artist}</Artist>
                <Album>{media.album}</Album>
              </>
            ) : (
              !media.hideControls && <Controls />
            )}
          </Info>
        </Box>
        {isSpotify && (
          <SpotifyControlWrapper>
            <Controls isSpotify />
          </SpotifyControlWrapper>
        )}
      </Inner>
      <CoverDominantColor src={media.image} />
    </Root>
  );
}
