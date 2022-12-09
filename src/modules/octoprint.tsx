import { HassEntity } from "home-assistant-js-websocket";
//@ts-expect-error
import humanizeDuration from "humanize-duration";
import { css, styled } from "../styling";
import { formatNumericValue } from "../utils/general";
import { makeServiceCall, useEntity } from "../utils/hass";
import PillButton from "../components/PillButton";
import ComponentGroup from "../components/ComponentGroup";
import CameraStream from "../components/CameraStream";
import Stack from "../components/Stack";
import Paper from "../components/Paper";
import TitleCard from "../components/TitleCard";

const CameraWrapper = styled(
  Paper,
  css`
    line-height: 0;
    overflow: hidden;
  `
);

function OctoprintModule() {
  const isPrinting =
    useEntity("binary_sensor.octoprint_printing")?.state === "on";

  return (
    <Stack>
      <TitleCard
        title="Impressora 3D"
        action={
          isPrinting ? (
            <PillButton
              icon="mdi:stop"
              label="Parar"
              onClick={makeServiceCall("button", "press", {
                entity_id: "button.octoprint_stop_job",
              })}
            />
          ) : (
            <PillButton
              icon="mdi:power"
              label="Desligar"
              onClick={makeServiceCall("switch", "turn_off", {
                entity_id: "switch.impressora_3d",
              })}
            />
          )
        }
      />
      <CameraWrapper>
        <CameraStream entityId="camera.impressora_3d" aspectRatio={16 / 9} />
      </CameraWrapper>
      {isPrinting && (
        <ComponentGroup
          layout="list"
          items={[
            {
              label: "Progresso",
              entityId: "sensor.octoprint_job_percentage",
              renderListContent: (entity: HassEntity) => {
                return formatNumericValue(entity.state, "%");
              },
            },
            {
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
            {
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
                    });
                  } catch (_) {}
                }

                return "Desconhecido";
              },
            },
          ]}
        />
      )}
    </Stack>
  );
}

export default <OctoprintModule />;
