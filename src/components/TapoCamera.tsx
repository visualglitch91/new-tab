import { callService } from "../utils/hass";
import Camera from "./Camera";

export default function TapoCamera({
  entityId,
  aspectRatio,
  moveButtons,
}: {
  entityId: string;
  aspectRatio: number;
  moveButtons?: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
}) {
  function onMove(direction: "LEFT" | "RIGHT" | "UP" | "DOWN") {
    if (!moveButtons) {
      return;
    }

    callService("button", "press", {
      entity_id: {
        LEFT: moveButtons.left,
        RIGHT: moveButtons.right,
        UP: moveButtons.up,
        DOWN: moveButtons.down,
      }[direction],
    });
  }

  return (
    <Camera
      entityId={entityId}
      aspectRatio={aspectRatio}
      onMove={moveButtons ? onMove : undefined}
    />
  );
}
