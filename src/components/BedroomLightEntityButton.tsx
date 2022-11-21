import { makeServiceCall, useEntity } from "../utils/hass";
import EntityButton from "./EntityButton";

export default function BedroomLightEntityButton() {
  const powerEntityId = "switch.quarto_luz";
  const lightEntityId = "light.luz_cor_1";
  const powerOff = useEntity(powerEntityId)?.state !== "on";
  const lightOff = useEntity(lightEntityId)?.state !== "on";
  const entityId = powerOff || lightOff ? powerEntityId : lightEntityId;

  return (
    <EntityButton
      changeTimeout={5_000}
      label="Luz"
      icon="mdi-lightbulb-group"
      entityId={entityId}
      onTap={makeServiceCall(
        "homeassistant",
        powerOff ? "turn_on" : "turn_off",
        { entity_id: powerEntityId }
      )}
    />
  );
}
