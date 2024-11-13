import { hassUrl, useEntities } from "$client/utils/hass";

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
}

const mediaInfo: Record<string, CurrentMedia> = {
  Globo: {
    image: getImageUrl("globo.jpg"),
    title: "Globo ao Vivo",
  },
  KissFM: {
    image: getImageUrl("kissfm.png"),
    title: "Kiss FM",
    hideControls: true,
  },
  AlphaFM: {
    image: getImageUrl("alphafm.png"),
    title: "Alpha FM",
    hideControls: true,
  },
  "Nintendo Switch": {
    image: getImageUrl("switch.png"),
    title: "Nintendo Switch",
    hideControls: true,
  },
  "Playstation 5": {
    image: getImageUrl("playstation5.jpg"),
    title: "PlayStation 5",
    hideControls: true,
  },
  miboxGeneric: {
    image: getImageUrl("androidtv.png"),
    title: "AndroidTV",
  },
  Globoplay: {
    image: getImageUrl("globoplay.jpg"),
    title: "GloboPlay",
  },
  "Disney+": {
    image: getImageUrl("disneyplus.jpg"),
    title: "Disney+",
  },
  PrimeVideo: {
    image: getImageUrl("primevideo.jpg"),
    title: "Prime Video",
  },
  Crunchyroll: {
    image: getImageUrl("crunchyroll.jpg"),
    title: "CrunchyRoll",
  },
  YouTube: {
    image: getImageUrl("youtube.jpg"),
    title: "YouTube",
  },
  Twitch: {
    image: getImageUrl("twitch.jpg"),
    title: "Twitch",
  },
  Spotify: {
    image: getImageUrl("spotify.png"),
    title: "Spotify",
  },
  Jellyfin: {
    image: getImageUrl("jellyfin.jpg"),
    title: "Jellyfin",
  },
};

export function useCurrentMedia(): CurrentMedia | null {
  const {
    "media_player.spotify_visualglitch91": spotify,
    "media_player.xiaomi_tv_box": mibox,
    "media_player.sala_tv": tv,
    "media_player.sala_jellyfin": jellyfin,
  } = useEntities(
    "media_player.spotify_visualglitch91",
    "media_player.xiaomi_tv_box",
    "media_player.sala_tv",
    "media_player.sala_jellyfin"
  );

  if (!tv || tv.state !== "on") {
    return null;
  }

  if (!mibox) {
    return null;
  }

  const { source } = tv.attributes;

  if (
    source === "Spotify" &&
    spotify &&
    spotify.state !== "idle" &&
    ["Casa", "echo home teather"].includes(spotify.attributes.source)
  ) {
    const attrs = spotify.attributes;

    return {
      spotify: true,
      image: `${hassUrl}${attrs.entity_picture}`,
      album: attrs.media_album_name,
      artist: attrs.media_artist,
      title: attrs.media_title,
    };
  }

  if (source === "Jellyfin" && jellyfin && jellyfin.state !== "idle") {
    const attrs = jellyfin.attributes;

    return {
      image: attrs.entity_picture!,
      album: attrs.media_album_name,
      artist: attrs.media_artist,
      title: attrs.media_title,
    };
  }

  return mediaInfo[source] || mediaInfo["miboxGeneric"];
}
