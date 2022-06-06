import { callService, useHass } from "../utils/hass.mjs";
import { h } from "../utils/preact.mjs";
import Switch from "./Switch.mjs";

export default function EntitiesSwitch({ entityIds, condition = "some" }) {
  const { states } = useHass();
  const checked = entityIds[condition]((id) => states[id].state === "on");

  function toggleAll() {
    entityIds.forEach((id) => {
      callService("homeassistant", checked ? "turn_off" : "turn_on", {
        entity_id: id,
      });
    });
  }

  return h`
    <${Switch}
      checked=${checked}
      onInput=${toggleAll}
    />
  `;
}
