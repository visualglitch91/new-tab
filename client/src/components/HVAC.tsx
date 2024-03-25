import { List, Stack, Switch } from "@mui/material";
import { callService, makeServiceCall, useEntity } from "$client/utils/hass";
import { formatNumericValue } from "$client/utils/general";
import ListItem from "./ListItem";
import AltIconButton from "./AltIconButton";
import Icon from "./Icon";
import GlossyPaper from "./GlossyPaper";

const entityId = "climate.ar_condicionado";

export default function HVAC() {
  const { state, attributes } = useEntity(entityId) || {};
  const on = state !== "off";

  if (!attributes) {
    return null;
  }

  const {
    min_temp: minTemp,
    max_temp: maxTemp,
    current_temperature: currentTemp,
    temperature: targetTemp,
  } = attributes;

  const currentTempStr = currentTemp
    ? formatNumericValue(currentTemp, "°C", 0)
    : null;

  const targetTempStr = targetTemp
    ? formatNumericValue(targetTemp, "°C", 0)
    : null;

  const setTemperature = (temperature: number) => {
    return makeServiceCall("climate", "set_temperature", {
      temperature,
      entity_id: entityId,
    });
  };

  return (
    <List component={GlossyPaper}>
      <ListItem
        primaryText="Ar-Condicionado"
        secondaryText={
          <>
            {currentTemp &&
            targetTemp &&
            Math.abs(currentTemp - targetTemp) < 0.7
              ? targetTempStr
              : [currentTempStr, targetTempStr].filter(Boolean).join(" › ")}
          </>
        }
        icon="mdi:snowflake-thermometer"
        endSlot={
          <Stack direction="row" alignItems="center" gap={1}>
            {on && (
              <>
                <AltIconButton
                  disabled={targetTemp === minTemp}
                  sx={{ "--size": "24px" }}
                  onClick={setTemperature(targetTemp - 1)}
                >
                  <Icon size={16} icon="mdi:minus" />
                </AltIconButton>
                <AltIconButton
                  disabled={targetTemp === maxTemp}
                  sx={{ "--size": "24px" }}
                  onClick={setTemperature(targetTemp + 1)}
                >
                  <Icon size={16} icon="mdi:plus" />
                </AltIconButton>
              </>
            )}
            <Switch
              sx={on ? { ml: -3 } : {}}
              checked={on}
              onChange={(_, checked) => {
                callService("climate", checked ? "turn_on" : "turn_off", {
                  entity_id: entityId,
                });
              }}
            />
          </Stack>
        }
      />
    </List>
  );
}
