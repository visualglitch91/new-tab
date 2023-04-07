import { HassEntity } from "home-assistant-js-websocket";
//@ts-expect-error
import humanizeDuration from "humanize-duration";
import { css, styled } from "../styling";
import { formatNumericValue } from "../utils/general";
import { useConfirm } from "../utils/useConfirm";
import { makeServiceCall, useEntities, useEntity } from "../utils/hass";
import PillButton from "../components/PillButton";
import ComponentGroup from "../components/ComponentGroup";
import CameraStream from "../components/CameraStream";
import Stack from "../components/Stack";
import Paper from "../components/Paper";
import TitleCard from "../components/TitleCard";
import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import useLatestRef from "../utils/useLatestRef";
import FlexRow from "../components/FlexRow";

const CameraWrapper = styled(
  Paper,
  css`
    line-height: 0;
    overflow: hidden;
  `
);

function TemperatureRow({
  label,
  actualEntityId,
  targetEntityId,
}: {
  label: string;
  actualEntityId: string;
  targetEntityId: string;
}) {
  const { [actualEntityId]: actual, [targetEntityId]: target } = useEntities(
    actualEntityId,
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
    <ListItem label={label} icon="icofont-thermometer">
      {actualTemp && targetTemp && Math.abs(actualTemp - targetTemp) < 0.7
        ? targetTempStr
        : [actualTempStr, targetTempStr].filter(Boolean).join(" > ") ||
          "Desconhecido"}
    </ListItem>
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
    <ListItem label="Auto-Desligar" icon="power">
      <FlexRow>
        {humanizeDuration(remaningTime, { round: true })}
        <PillButton
          onClick={makeServiceCall("script", "turn_off", {
            entity_id: entity.entity_id,
          })}
          label="Abortar"
        />
      </FlexRow>
    </ListItem>
  );
}

function KlipperModule() {
  const [confirm, $confirm] = useConfirm();
  const isPrinting =
    useEntity("sensor.klipper_current_print_state")?.state === "printing";

  const autoShutdownEntity = useEntity(
    "script.impressora_3d_desligamento_automatico"
  );

  return (
    <Stack>
      {$confirm}
      <TitleCard
        title="Impressora 3D"
        action={
          isPrinting ? (
            <PillButton
              icon="mdi:stop"
              label="Parar"
              onClick={() => {
                confirm({
                  title: "Parar Impressão",
                  onConfirm: makeServiceCall("script", "turn_on", {
                    entity_id: "script.impressora_3d_parar_impressao",
                  }),
                });
              }}
            />
          ) : (
            <PillButton
              icon="mdi:power"
              label="Desligar"
              onClick={() => {
                confirm({
                  title: "Desligar Impressora",
                  onConfirm: makeServiceCall("switch", "turn_off", {
                    entity_id: "switch.impressora_3d",
                  }),
                });
              }}
            />
          )
        }
      />
      <CameraWrapper>
        <CameraStream entityId="camera.impressora_3d" aspectRatio={4 / 3} />
      </CameraWrapper>
      <ComponentGroup
        layout="list"
        items={[
          <TemperatureRow
            label="Mesa"
            actualEntityId="sensor.klipper_bed_temperature"
            targetEntityId="sensor.klipper_bed_target"
          />,
          <TemperatureRow
            label="Hotend"
            actualEntityId="sensor.klipper_extruder_temperature"
            targetEntityId="sensor.klipper_extruder_target"
          />,
          autoShutdownEntity?.state === "on" ? (
            <AutoShutdown entity={autoShutdownEntity} />
          ) : (
            {
              label: "Auto-Desligar",
              entityId: "input_boolean.impressora_3d_desligamento_automatico",
            }
          ),
          isPrinting && {
            label: "Arquivo",
            entityId: "sensor.klipper_filename",
            icon: "file-outline",
            renderListContent: (entity) =>
              entity.state.endsWith(".gcode")
                ? entity.state.slice(0, -6)
                : entity.state,
          },
          isPrinting && {
            label: "Progresso",
            entityId: "sensor.klipper_progress",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%", 0),
          },
          isPrinting && {
            label: "Restante",
            entityId: "sensor.klipper_print_time_left",
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
        ]}
      />
    </Stack>
  );
}

export default <KlipperModule />;
