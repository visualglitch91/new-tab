import { useEffect, useState } from "react";
import { styled } from "@mui/material";
import { MediaItem as IMediaItem } from "@home-control/types/media-center";
import api from "../../utils/api";
import MemoryCache from "../../utils/MemoryCache";

function modifyImageUrl(inputUrl: string) {
  const modifiedUrl = inputUrl.replace(
    /(\/MediaCover\/\d+\/poster)(\.jpg)(\?lastWrite=\d+)/,
    `$1-500.jpg$3`
  );

  return modifiedUrl;
}

const PosterRoot = styled("img")(({ theme }) => ({
  width: 42,
  height: 48,
  objectFit: "cover",
  borderRadius: 6,
  backgroundColor: theme.palette.background.default,
  flexShrink: 0,
}));

const imageCache = new MemoryCache<string>({
  ttl: 10_000, //5 * 60_000,
  onDispose: (url) => URL.revokeObjectURL(url),
});

export default function MediaPoster({ item }: { item: IMediaItem }) {
  const [img, setImg] = useState("");

  useEffect(() => {
    const { type, poster } = item;

    if (!poster) {
      return;
    }

    const abortController = new AbortController();
    const cached = imageCache.get(poster);

    if (cached) {
      setImg(cached);
      return;
    }

    api(
      `/media-center/${type}/image-proxy?path=${modifyImageUrl(poster)}`,
      "get",
      undefined,
      { responseType: "blob", signal: abortController.signal }
    )
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => {
        imageCache.set(poster, url);
        setImg(url);
      });

    return () => {
      abortController.abort();
    };
    //eslint-disable-next-line
  }, [item.type, item.poster]);

  if (!img) {
    return (
      <PosterRoot
        as="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {item.title.charAt(0)}
      </PosterRoot>
    );
  }

  return <PosterRoot src={img} />;
}
