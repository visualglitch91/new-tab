import { useState } from "react";
import { makeServiceCall, useHass } from "../utils/hass";
import Stack from "../components/Stack";
import Paper from "../components/Paper";
import FlexRow from "../components/FlexRow";
import TitleCard from "../components/TitleCard";
import CameraStream from "../components/CameraStream";
import CameraSnapshot from "../components/CameraSnapshot";
import PillButton from "../components/PillButton";
import Button from "../components/Button";
import Icon from "../components/Icon";
import "./cameras.css";

function Camera({
  stream,
  cameraName,
}: {
  stream: boolean;
  cameraName: string;
}) {
  const { states } = useHass();

  const online = states[`binary_sensor.${cameraName}_online`].state === "on";
  const streamEntityId = `camera.${cameraName}_stream`;
  const onvifEntityId = `camera.${cameraName}_onvif`;

  function pan(direction: "LEFT" | "RIGHT") {
    return makeServiceCall("onvif", "ptz", {
      pan: direction,
      move_mode: "ContinuousMove",
      entity_id: onvifEntityId,
    });
  }

  function tilt(direction: "UP" | "DOWN") {
    return makeServiceCall("onvif", "ptz", {
      tilt: direction,
      move_mode: "ContinuousMove",
      entity_id: onvifEntityId,
    });
  }

  return (
    <Paper className="module__camera">
      {online ? (
        stream ? (
          <CameraStream entityId={streamEntityId} />
        ) : (
          <CameraSnapshot entityId={streamEntityId} />
        )
      ) : (
        <div className="module__camera__overlay">Câmera Indisponível</div>
      )}
      {online && (
        <FlexRow className="module__camera__buttons">
          <PillButton icon="arrow-left" onClick={pan("LEFT")} />
          <PillButton icon="arrow-down" onClick={tilt("DOWN")} />
          <PillButton icon="arrow-up" onClick={tilt("UP")} />
          <PillButton icon="arrow-right" onClick={pan("RIGHT")} />
        </FlexRow>
      )}
    </Paper>
  );
}

function Cameras() {
  const [stream, setStream] = useState(false);

  return (
    <Stack>
      <TitleCard
        title="Câmeras"
        action={
          stream ? (
            <Button onTap={() => setStream(false)}>
              <Icon icon="stop" />
            </Button>
          ) : (
            <Button onTap={() => setStream(true)}>
              <Icon icon="play" />
            </Button>
          )
        }
      />
      <Camera stream={stream} cameraName="luatek_44" />
      <Camera stream={stream} cameraName="ipega_45" />
    </Stack>
  );
}

export default <Cameras />;
