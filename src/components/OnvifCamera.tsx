import { callService } from "../utils/hass";
import Camera from "./Camera";

export default function OnvifCamera({
  stream,
  entityId,
}: {
  stream: boolean;
  entityId: string;
}) {
  function onMove(direction: "LEFT" | "RIGHT" | "UP" | "DOWN") {
    if (direction === "LEFT" || direction === "RIGHT") {
      callService("onvif", "ptz", {
        pan: direction,
        move_mode: "ContinuousMove",
        entity_id: entityId,
      });
    } else {
      callService("onvif", "ptz", {
        tilt: direction,
        move_mode: "ContinuousMove",
        entity_id: entityId,
      });
    }
  }

  return <Camera stream={stream} entityId={entityId} onMove={onMove} />;
}
