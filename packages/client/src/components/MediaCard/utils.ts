import { hassUrl, useEntities } from "../../utils/hass";

function getImageUrl(file: string) {
  return new URL(`./images/${file}`, import.meta.url).href;
}

interface CurrentMedia {
  image: string;
  title: string;
  album?: string;
  artist?: string;
  spotify?: boolean;
  volumeOnly?: boolean;
}

const mediaInfo: Record<string, CurrentMedia> = {
  liveTV: {
    image: getImageUrl("globo.webp"),
    title: "Globo ao Vivo",
    volumeOnly: true,
  },
  hdmi1: {
    image: getImageUrl("switch.png"),
    title: "Nintendo Switch",
    volumeOnly: true,
  },
  hdmi2: {
    image: getImageUrl("playstation5.jpg"),
    title: "PlayStation 5",
    volumeOnly: true,
  },
  miboxGeneric: {
    image: getImageUrl("androidtv.png"),
    title: "AndroidTV",
  },
  "com.globo.globotv": {
    image: getImageUrl("globoplay.jpg"),
    title: "GloboPlay",
  },
  "com.plexapp.android": {
    image: getImageUrl("plex.jpg"),
    title: "Plex",
  },
  "com.disney.disneyplus": {
    image: getImageUrl("disneyplus.jpg"),
    title: "Disney+",
  },
  "com.hbo.hbonow": {
    image: getImageUrl("hbomax.jpg"),
    title: "HBO Max",
  },
  "com.disney.starplus": {
    image: getImageUrl("starplus.jpg"),
    title: "Star+",
  },
  "com.amazon.amazonvideo.livingroom": {
    image: getImageUrl("primevideo.jpg"),
    title: "Prime Video",
  },
  "com.crunchyroll.crunchyroid": {
    image: getImageUrl("crunchyroll.jpg"),
    title: "CrunchyRoll",
  },
  "com.teamsmart.videomanager.tv": {
    image: getImageUrl("youtube.jpg"),
    title: "YouTube",
  },
  "org.xbmc.kodi": {
    image: getImageUrl("kodi.jpg"),
    title: "Kodi",
  },
  "tv.twitch.android.app": {
    image: getImageUrl("twitch.jpg"),
    title: "Twitch",
  },
  "com.spotify.tv.android": {
    image: getImageUrl("spotify.png"),
    title: "Spotify",
  },
  "org.jellyfin.androidtv": {
    image: getImageUrl("jellyfin.jpg"),
    title: "Jellyfin",
  },
};

export function useCurrentMedia(): CurrentMedia | null {
  const {
    "script.sala_mibox_ligar": { state: miboxLoading } = { state: null },
    "input_text.sala_receiver_entrada": { state: receiver } = { state: null },
    "media_player.spotify_visualglitch91": spotify,
    "media_player.xiaomi_tv_box": mibox,
    "media_player.sala_tv": tv,
  } = useEntities(
    "script.sala_mibox_ligar",
    "input_text.sala_receiver_entrada",
    "media_player.spotify_visualglitch91",
    "media_player.xiaomi_tv_box",
    "media_player.sala_tv"
  );

  if (miboxLoading === "on" || !tv || tv.state !== "on") {
    return null;
  }

  if (tv.attributes.source === "live_tv") {
    return mediaInfo["liveTV"];
  }

  switch (receiver) {
    case "hdmi1":
    case "hdmi2":
      return mediaInfo[receiver];
  }

  if (!mibox) {
    return null;
  }

  const appId = mibox.attributes.app_id;

  if (
    spotify &&
    spotify.state !== "idle" &&
    spotify.attributes.source === "Xiaomi TV Box"
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

  if (appId) {
    return mediaInfo[appId] || null;
  }

  return mediaInfo["miboxGeneric"];
}
