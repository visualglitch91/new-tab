import { Switch } from "@mui/material";
import { callService, useEntities } from "$app/utils/hass";

export default function EntitiesSwitch({
  entityIds,
  condition = "some",
}: {
  entityIds: string[];
  condition?: "some" | "every";
}) {
  const states = useEntities(...entityIds);
  const checked = entityIds[condition]((id) => states[id]?.state === "on");

  function toggleAll() {
    entityIds.forEach((id) => {
      callService("homeassistant", checked ? "turn_off" : "turn_on", {
        entity_id: id,
      });
    });
  }

  return <Switch checked={checked} onChange={toggleAll} />;
}
