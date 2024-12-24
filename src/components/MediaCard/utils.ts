import { hassUrl, useEntity } from "$app/utils/hass";

function getImageUrl(file: string) {
  return new URL(`./images/${file}`, import.meta.url).href;
}

interface CurrentMedia {
  image: string;
  title: string;
  album?: string;
  artist?: string;
  spotify?: boolean;
  hideControls?: boolean;
  buildinImage?: boolean;
}

const mediaInfoMap: Record<string, CurrentMedia> = {
  "kiss fm": {
    image: getImageUrl("kissfm.png"),
    title: "Kiss FM",
    hideControls: true,
    buildinImage: true,
  },
  "alpha fm": {
    image: getImageUrl("alphafm.png"),
    title: "Alpha FM",
    hideControls: true,
  },
  "nintendo switch": {
    image: getImageUrl("switch.png"),
    title: "Nintendo Switch",
    hideControls: true,
  },
  "playstation 5": {
    image: getImageUrl("playstation5.jpg"),
    title: "PlayStation 5",
    hideControls: true,
  },
  generic: {
    image: getImageUrl("androidtv.png"),
    title: "AndroidTV",
  },
  globoplay: {
    image: getImageUrl("globoplay.jpg"),
    title: "GloboPlay",
  },
  disney: {
    image: getImageUrl("disneyplus.jpg"),
    title: "Disney+",
  },
  primevideo: {
    image: getImageUrl("primevideo.jpg"),
    title: "Prime Video",
  },
  crunchyroll: {
    image: getImageUrl("crunchyroll.jpg"),
    title: "CrunchyRoll",
  },
  youtube: {
    image: getImageUrl("youtube.jpg"),
    title: "YouTube",
  },
  twitch: {
    image: getImageUrl("twitch.jpg"),
    title: "Twitch",
  },
  spotify: {
    image: getImageUrl("spotify.png"),
    title: "Spotify",
  },
  jellyfin: {
    image: getImageUrl("jellyfin.jpg"),
    title: "Jellyfin",
  },
};

export function useCurrentMedia(): CurrentMedia | null {
  const entity = useEntity("media_player.sala_media_player");

  const isOn = Boolean(
    entity?.state && !["off", "unknown", "unavailable"].includes(entity.state)
  );

  if (!entity || !isOn) {
    return null;
  }

  const { attributes: attrs } = entity;

  const mediaInfo = mediaInfoMap[attrs.source];

  if (attrs.media_title) {
    const image =
      mediaInfo?.buildinImage || !attrs.entity_picture
        ? mediaInfo?.image
        : attrs.entity_picture;

    return {
      spotify: attrs.source === "spotify",
      image: image
        ? image.startsWith("http")
          ? image
          : `${hassUrl}${image}`
        : "",
      album: attrs.media_album_name,
      artist: attrs.media_artist,
      title: attrs.media_title,
      hideControls: mediaInfo?.hideControls,
    };
  }

  return mediaInfo || mediaInfoMap["generic"];
}
