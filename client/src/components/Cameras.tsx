import { Stack } from "@mui/material";
import { useEntities } from "$client/utils/hass";
import TapoCamera from "./TapoCamera";

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

export default function Cameras() {
  const availableEntityIds = useAvailableCameras();

  return (
    <Stack spacing={3}>
      {availableEntityIds.map((availabilityEntityId) => {
        const camera = cameras.find(
          (it) => it.availability === availabilityEntityId
        );

        if (!camera) {
          return null;
        }

        return (
          <TapoCamera
            key={camera.stream}
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
