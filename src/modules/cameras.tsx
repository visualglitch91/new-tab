import { useHass } from "../utils/hass";
import Stack from "../components/Stack";
import Paper from "../components/Paper";
import TitleCard from "../components/TitleCard";
import CameraStream from "../components/CameraStream";
import "./cameras.css";

function Camera({ entityId }: { entityId: string }) {
  const { states } = useHass();
  const cameraName = entityId.split(".")[1];

  const isOnline =
    states[`binary_sensor.camera_${cameraName}_online`].state === "on";

  return (
    <Paper class="module__cameras__camera">
      {isOnline ? (
        <CameraStream entityId={entityId} />
      ) : (
        <div class="module__cameras__camera__overlay">Câmera Indisponível</div>
      )}
    </Paper>
  );
}

export default (
  <Stack>
    <TitleCard title="Câmeras" />
    <Camera entityId="camera.192_168_0_44" />
    <Camera entityId="camera.192_168_0_45" />
  </Stack>
);
