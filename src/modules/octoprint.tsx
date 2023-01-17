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
    ? formatNumericValue(actualTemp, "°C")
    : null;

  const targetTempStr = targetTemp
    ? formatNumericValue(targetTemp, "°C")
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
    <ListItem label="Desligamento Automático" icon="power">
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

function OctoprintModule() {
  const [confirm, $confirm] = useConfirm();
  const isPrinting =
    useEntity("binary_sensor.octoprint_printing")?.state === "on";

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
                  onConfirm: makeServiceCall("button", "press", {
                    entity_id: "button.octoprint_stop_job",
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
            actualEntityId="sensor.octoprint_actual_bed_temp"
            targetEntityId="sensor.octoprint_target_bed_temp"
          />,
          <TemperatureRow
            label="Hotend"
            actualEntityId="sensor.octoprint_actual_tool0_temp"
            targetEntityId="sensor.octoprint_target_tool0_temp"
          />,
          autoShutdownEntity?.state === "on" ? (
            <AutoShutdown entity={autoShutdownEntity} />
          ) : (
            "input_boolean.impressora_3d_desligamento_automatico"
          ),
          isPrinting && {
            label: "Início",
            entityId: "sensor.octoprint_start_time",
            renderListContent: (entity: HassEntity) => {
              if (entity.state !== "unknown") {
                const date = new Date(entity.state);
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${hours}:${minutes}`;
              }

              return "Desconhecido";
            },
          },
          isPrinting && {
            label: "Restante",
            entityId: "sensor.octoprint_estimated_finish_time",
            renderListContent: (entity: HassEntity) => {
              if (entity.state !== "unknown") {
                try {
                  //@ts-ignore
                  const eta = new Date(entity.state) - new Date();
                  return humanizeDuration(eta, {
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

export default <OctoprintModule />;
