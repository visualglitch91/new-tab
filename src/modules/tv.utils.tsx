import { makeTurnOnCall, useEntity } from "../utils/hass";
import ButtonCard from "../components/ButtonCard";
import Icon from "../components/Icon";
import CircularLoading from "../components/CircularLoading";

export function IconButtonCard({
  icon,
  size,
  action,
  repeatOnHold,
}: {
  icon: string;
  size: number;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  const onHold = repeatOnHold ? action : undefined;

  return (
    <ButtonCard onClick={action} onLongPress={onHold} onHold={onHold}>
      <Icon icon={icon} size={size} />
    </ButtonCard>
  );
}

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "70%",
} as const;

function getImageUrl(file: string) {
  return new URL(`../assets/${file}`, import.meta.url).href;
}

const assets = {
  disneyplus: getImageUrl("disneyplus.png"),
  globo: getImageUrl("globo.png"),
  globoplay: getImageUrl("globoplay.png"),
  hbomax: getImageUrl("hbomax.png"),
  netflix: getImageUrl("netflix.png"),
  plex: getImageUrl("plex.png"),
  prime_video: getImageUrl("prime_video.png"),
  discovery_plus: getImageUrl("discovery_plus.png"),
  twitch: getImageUrl("twitch.png"),
  ps5: getImageUrl("ps5.png"),
  spotify: getImageUrl("spotify.png"),
  starplus: getImageUrl("starplus.png"),
  switch: getImageUrl("switch.png"),
  windows: getImageUrl("windows.png"),
  youtube: getImageUrl("youtube.png"),
  retropi: getImageUrl("retropi.png"),
  kodi: getImageUrl("kodi.png"),
  crunchyroll: getImageUrl("crunchyroll.png"),
};

export function ImageButtonCard({
  asset,
  action,
  repeatOnHold,
}: {
  asset: keyof typeof assets;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  const onHold = repeatOnHold ? action : undefined;

  return (
    <ButtonCard onClick={action} onLongPress={onHold} onHold={onHold}>
      <img alt="" src={assets[asset]} style={imgStyle} />
    </ButtonCard>
  );
}

export function ScriptImageButtonCard({
  asset,
  script,
}: {
  asset: keyof typeof assets;
  script?: string;
}) {
  const entityId = `script.${script}`;
  const loading = useEntity(entityId)?.state === "on";

  return (
    <ButtonCard onClick={makeTurnOnCall(entityId)}>
      {loading ? (
        <CircularLoading />
      ) : (
        <img alt="" src={assets[asset]} style={imgStyle} />
      )}
    </ButtonCard>
  );
}
