import { callService, useHass } from "../utils/hass";
import Switch from "./Switch";

export default function EntitiesSwitch({
  entityIds,
  condition = "some",
}: {
  entityIds: string[];
  condition?: "some" | "every";
}) {
  const { states } = useHass();
  const checked = entityIds[condition]((id) => states[id].state === "on");

  function toggleAll() {
    entityIds.forEach((id) => {
      callService("homeassistant", checked ? "turn_off" : "turn_on", {
        entity_id: id,
      });
    });
  }

  return <Switch checked={checked} onInput={toggleAll} />;
}
