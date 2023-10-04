import { Button, List, Stack, styled } from "@mui/material";
import { HassEntity } from "home-assistant-js-websocket";
import humanizeDuration from "humanize-duration";
import { formatNumericValue } from "../utils/general";
import useConfirm from "../utils/useConfirm";
import { makeServiceCall, useEntities, useEntity } from "../utils/hass";
import CameraStream from "../components/CameraStream";
import GlossyPaper from "../components/GlossyPaper";
import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import useLatestRef from "../utils/useLatestRef";
import SectionTitle from "./SectionTitle";
import EntityListItem from "./EntityListItem";
import AltIconButton from "./AltIconButton";
import Icon from "./Icon";

const CameraWrapper = styled(GlossyPaper)({
  lineHeight: 0,
  overflow: "hidden",
});

function TemperatureRow({
  label,
  currentEntityId,
  targetEntityId,
}: {
  label: string;
  currentEntityId: string;
  targetEntityId: string;
}) {
  const { [currentEntityId]: actual, [targetEntityId]: target } = useEntities(
    currentEntityId,
    targetEntityId
  );

  const actualTemp = actual?.state ? Number(actual?.state) : 0;
  const targetTemp = target?.state ? Number(target?.state) : 0;

  const actualTempStr = actualTemp
    ? formatNumericValue(actualTemp, "°C", 0)
    : null;

  const targetTempStr = targetTemp
    ? formatNumericValue(targetTemp, "°C", 0)
    : null;

  return (
    <ListItem
      primaryText={label}
      icon="icofont-thermometer"
      endSlot={
        actualTemp && targetTemp && Math.abs(actualTemp - targetTemp) < 0.7
          ? targetTempStr
          : [actualTempStr, targetTempStr].filter(Boolean).join(" > ") ||
            "Desconhecido"
      }
    />
  );
}

function AutoShutdown({ entity }: { entity: HassEntity }) {
  const lastTriggeredRef = useLatestRef(entity.attributes.last_triggered);

  function getRemaningTime() {
    return Math.max(
      0,
      //@ts-ignore
      30_000 - Math.round(new Date() - new Date(lastTriggeredRef.current))
    );
  }

  const [remaningTime, setRemaningTime] = useState(getRemaningTime);

  useEffect(() => {
    setInterval(() => setRemaningTime(getRemaningTime), 1000);
    //eslint-disable-next-line
  }, []);

  return (
    <ListItem
      primaryText="Auto-Desligar"
      icon="power"
      endSlot={
        <Stack spacing={2}>
          {humanizeDuration(remaningTime, { round: true, language: "pt" })}
          <Button
            size="small"
            onClick={makeServiceCall("script", "turn_off", {
              entity_id: entity.entity_id,
            })}
          >
            Abortar
          </Button>
        </Stack>
      }
    />
  );
}

export default function Klipper() {
  const confirm = useConfirm();
  const isPrinting =
    useEntity("sensor.impressora_3d_estado_atual")?.state === "printing";

  const autoShutdownEntity = useEntity(
    "script.impressora_3d_desligamento_automatico"
  );

  return (
    <Stack spacing={2}>
      <SectionTitle>
        <span>Impressora 3D</span>
        {isPrinting ? (
          <AltIconButton
            onClick={() => {
              confirm({
                title: "Parar Impressão",
                onConfirm: makeServiceCall("button", "turn_on", {
                  entity_id: "button.impressora_3d_macro_abort_print",
                }),
              });
            }}
          >
            <Icon size={18} icon="stop" />
          </AltIconButton>
        ) : (
          <AltIconButton
            onClick={() => {
              confirm({
                title: "Desligar Impressora",
                onConfirm: makeServiceCall("switch", "turn_off", {
                  entity_id: "switch.impressora_3d_servidor",
                }),
              });
            }}
          >
            <Icon size={18} icon="power" />
          </AltIconButton>
        )}
      </SectionTitle>
      <CameraWrapper>
        <CameraStream entityId="camera.impressora_3d" aspectRatio={4 / 3} />
      </CameraWrapper>
      <List component={GlossyPaper}>
        <TemperatureRow
          label="Mesa"
          currentEntityId="sensor.impressora_3d_mesa_temperatura_atual"
          targetEntityId="sensor.impressora_3d_mesa_temperatura_alvo"
        />
        <TemperatureRow
          label="Hotend"
          currentEntityId="sensor.impressora_3d_extrusora_temperatura_atual"
          targetEntityId="sensor.impressora_3d_extrusora_temperatura_alvo"
        />
        {autoShutdownEntity?.state === "on" ? (
          <AutoShutdown entity={autoShutdownEntity} />
        ) : (
          <EntityListItem
            label="Auto-Desligar"
            entityId="input_boolean.impressora_3d_desligamento_automatico"
          />
        )}
        {[
          isPrinting && {
            entityId: "sensor.impressora_3d_arquivo",
            icon: "file-outline",
            renderListContent: (entity: HassEntity) =>
              entity.state.endsWith(".gcode")
                ? entity.state.slice(0, -6)
                : entity.state,
          },
          isPrinting && {
            entityId: "sensor.impressora_3d_progresso",
            renderListContent: (entity: HassEntity) =>
              formatNumericValue(entity.state, "%", 0),
          },
          isPrinting && {
            entityId: "sensor.impressora_3d_tempo_restante",
            renderListContent: (entity: HassEntity) => {
              if (entity.state !== "unknown") {
                try {
                  return humanizeDuration(Number(entity.state) * 1000, {
                    language: "pt",
                    largest: 2,
                    units: ["d", "h", "m"],
                    round: true,
                  });
                } catch (_) {}
              }

              return "Desconhecido";
            },
          },
        ].map((it) => {
          if (!it) {
            return null;
          }

          return <EntityListItem {...it} />;
        })}
      </List>
    </Stack>
  );
}
