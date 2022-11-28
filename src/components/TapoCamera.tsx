import { callService } from "../utils/hass";
import Camera from "./Camera";

export default function TapoCamera({
  stream,
  entityId,
  moveButtons,
}: {
  stream: boolean;
  entityId: string;
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
      stream={stream}
      entityId={entityId}
      onMove={moveButtons ? onMove : undefined}
    />
  );
}
