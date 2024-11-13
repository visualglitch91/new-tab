import { useState } from "react";
import { List, Stack, Switch } from "@mui/material";
import { callService, makeServiceCall, useEntity } from "$client/utils/hass";
import { formatNumericValue } from "$client/utils/general";
import useMountEffect from "$client/utils/useMountEffect";
import useModal from "$client/utils/useModal";
import useAsyncChange from "$client/utils/useAsyncChange";
import Icon from "../Icon";
import ListItem from "../ListItem";
import MediaCard from "../MediaCard";
import GlossyPaper from "../GlossyPaper";
import AltIconButton from "../AltIconButton";
import DropdownButton from "../DropdownButton";
import DialogBase from "../DialogBase";
import DotLoading from "../DotLoading";

const salaTVEntityId = "media_player.sala_tv";

const ambilightVideoEntityId =
  "input_boolean.sidekick_lab_sala_ambilight_video";

const ambilightAudioEntityId =
  "input_boolean.sidekick_lab_sala_ambilight_audio";

function parseSourceName(source: string) {
  return (
    {
      "echo banheiro": "Banheiro",
      "Xiaomi Speaker-7874": "Quarto",
      "echo home theater": "Sala",
      "echo cozinha": "Cozinha",
      "echo escritório": "Escritório",
    }[source] || source
  );
}

export default function TV() {
  const mount = useModal();
  const [ambilightChanging, setAmbilightChanging] = useState(false);
  const ambilightVideoEntity = useEntity(ambilightVideoEntityId);
  const ambilightAudioEntity = useEntity(ambilightAudioEntityId);

  const selectedAmbilight =
    ambilightVideoEntity?.state === "on"
      ? { entity: ambilightVideoEntity, label: "Vídeo" }
      : ambilightAudioEntity?.state === "on"
      ? { entity: ambilightAudioEntity, label: "Áudio" }
      : { entity: null, label: "Desligado" };

  return (
    <Stack spacing={2}>
      <MediaCard />

      <List component={GlossyPaper} dense>
        <TVListItem />
        <ListItem
          icon="television-ambient-light"
          primaryText="Ambilight"
          endSlot={
            ambilightChanging ? (
              <DotLoading />
            ) : (
              <DropdownButton
                value={selectedAmbilight.label}
                options={["Desligado", "Áudio", "Vídeo"].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={(option) => {
                  setAmbilightChanging(true);

                  switch (option) {
                    case "Desligado":
                      if (selectedAmbilight.entity) {
                        callService("input_boolean", "turn_off", {
                          entity_id: selectedAmbilight.entity.entity_id,
                        });
                      }
                      break;
                    case "Vídeo":
                      callService("input_boolean", "turn_on", {
                        entity_id: ambilightVideoEntityId,
                      });
                      break;
                    case "Áudio":
                      callService("input_boolean", "turn_on", {
                        entity_id: ambilightAudioEntityId,
                      });
                      break;
                  }

                  setTimeout(() => {
                    setAmbilightChanging(false);
                  }, 30_000);
                }}
              />
            )
          }
        />
        <SpotifySource />
        <VolumeControlListItem
          label="Volume"
          entityId={salaTVEntityId}
          onMore={() => {
            mount((_, props) => (
              <DialogBase title="Volume" bottomMobileSheet {...props}>
                <List dense>
                  {[
                    [salaTVEntityId, "Volume Sala"],
                    ["media_player.escritorio_echo", "Volume Escritório"],
                    ["media_player.cozinha_echo", "Volume Cozinha"],
                    ["media_player.quarto_echo", "Volume Quarto"],
                    ["media_player.banheiro_echo", "Volume Banheiro"],
                  ].map(([id, label]) => (
                    <VolumeControlListItem
                      key={id}
                      label={label}
                      entityId={id}
                    />
                  ))}
                </List>
              </DialogBase>
            ));
          }}
        />
      </List>
    </Stack>
  );
}

function SpotifySource() {
  const entityId = "media_player.spotify_visualglitch91";
  const { source, source_list: sourceList = [] } =
    useEntity(entityId)?.attributes || {};

  if (!source) {
    return null;
  }

  return (
    <ListItem
      primaryText="Tocando em"
      startSlot={<Icon icon="mdi:spotify" />}
      endSlot={
        <DropdownButton
          value={source}
          options={sourceList.map((value: string) => ({
            label: parseSourceName(value),
            value,
          }))}
          onChange={(source) => {
            callService("media_player", "select_source", {
              entity_id: entityId,
              source,
            });
          }}
        />
      }
    />
  );
}

function TVListItem() {
  const {
    state: salaTV,
    attributes: {
      source: salaTVSource = "",
      source_list: salaTVSourceList = [] as string[],
    } = {},
  } = useEntity(salaTVEntityId) || {};

  const isOn = salaTV === "on";

  const { changing, change } = useAsyncChange({
    flag: isOn,
    timeout: 30_000,
  });

  return (
    <ListItem
      icon="television"
      primaryText="TV"
      endSlot={
        changing ? (
          <DotLoading />
        ) : salaTV === "on" ? (
          <DropdownButton
            value={salaTVSource}
            options={[...salaTVSourceList, "Desligar"]
              .filter((it) => !["Noop", "AndroidTV"].includes(it))
              .map((value: string) => ({
                value,
                label: value,
              }))}
            onChange={(source) => {
              if (source === "Desligar" && change()) {
                callService("media_player", "turn_off", {
                  entity_id: salaTVEntityId,
                });
              } else {
                callService("media_player", "select_source", {
                  entity_id: salaTVEntityId,
                  source,
                });
              }
            }}
          />
        ) : (
          <Switch
            checked={isOn}
            onChange={() => {
              if (change()) {
                callService("media_player", "turn_on", {
                  entity_id: salaTVEntityId,
                });
              }
            }}
          />
        )
      }
    />
  );
}

function VolumeControlListItem({
  entityId,
  label,
  onMore,
}: {
  entityId: string;
  label: string;
  onMore?: () => void;
}) {
  const entity = useEntity(entityId);
  const volume = entity?.attributes.volume_level;
  const isMuted = entity?.attributes.is_volume_muted;

  useMountEffect(() => {
    if (typeof volume === "undefined") {
      callService("media_player", "volume_set", {
        volume_level: 0.5,
        entity_id: entityId,
      });
    }
  });

  return (
    <ListItem
      primaryText={label || entity?.attributes.friendly_name || entityId}
      secondaryText={
        isMuted === true
          ? "Mudo"
          : typeof volume === "undefined"
          ? undefined
          : formatNumericValue(volume * 100, "%", 0)
      }
      startSlot={<Icon icon="mdi:volume-high" />}
      endSlot={
        <Stack direction="row" alignItems="center" gap={1}>
          <AltIconButton
            icon="volume-minus"
            size={24}
            onClick={makeServiceCall("media_player", "volume_down", {
              entity_id: entityId,
            })}
          />
          <AltIconButton
            icon="volume-off"
            size={24}
            onClick={makeServiceCall("media_player", "volume_mute", {
              entity_id: entityId,
              is_volume_muted: typeof isMuted === "boolean" ? !isMuted : true,
            })}
          />
          <AltIconButton
            icon="volume-plus"
            size={24}
            onClick={makeServiceCall("media_player", "volume_up", {
              entity_id: entityId,
            })}
          />
          {onMore && (
            <AltIconButton
              icon="mdi:dots-vertical"
              size={24}
              onClick={onMore}
            />
          )}
        </Stack>
      }
    />
  );
}
