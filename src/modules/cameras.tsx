import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";
import TapoCamera from "../components/TapoCamera";
import { useEntities } from "../utils/hass";

const cameras = [
  {
    stream: "camera.quarto",
    aspectRatio: 16 / 9,
    availability: "button.camera_quarto_move_up",
    up: "button.camera_quarto_move_up",
    down: "button.camera_quarto_move_down",
    left: "button.camera_quarto_move_left",
    right: "button.camera_quarto_move_right",
  },
  {
    stream: "camera.sala",
    availability: "button.camera_sala_move_up",
    aspectRatio: 16 / 9,
    up: "button.camera_sala_move_up",
    down: "button.camera_sala_move_down",
    left: "button.camera_sala_move_left",
    right: "button.camera_sala_move_right",
  },
];

export function useAvailableCameras() {
  const ids = cameras.map((it) => it.availability);
  const raw = useEntities(...ids);
  const entities = Object.values(raw);

  return entities
    .filter((it) => typeof it !== "undefined" && it.state !== "unavailable")
    .map((it) => it!.entity_id);
}

function CamerasModule() {
  const availableEntityIds = useAvailableCameras();

  return (
    <Stack>
      <TitleCard title="Câmeras" />
      {availableEntityIds.map((availabilityEntityId) => {
        const camera = cameras.find(
          (it) => it.availability === availabilityEntityId
        );

        if (!camera) {
          return null;
        }

        return (
          <TapoCamera
            entityId={camera.stream}
            aspectRatio={camera.aspectRatio}
            moveButtons={{
              up: camera.up,
              down: camera.down,
              left: camera.left,
              right: camera.right,
            }}
          />
        );
      })}
    </Stack>
  );
}

export default <CamerasModule />;
