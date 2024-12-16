import { Button, List, Stack, Switch } from "@mui/material";
import { callService, makeServiceCall, useEntity } from "$app/utils/hass";
import { formatNumericValue } from "$app/utils/general";
import { useMenu } from "$app/utils/useMenu";
import ListItem from "./ListItem";
import GlossyPaper from "./GlossyPaper";

const entityId = "climate.ar_condicionado";

function getSpeedLabels(speed: string) {
  return { low: "Fraco", medium: "Médio", high: "Forte" }[speed] || speed;
}

export default function HVAC() {
  const { state, attributes } = useEntity(entityId) || {};
  const showMenu = useMenu();
  const on = state !== "off";

  if (!attributes) {
    return null;
  }

  const {
    current_temperature: currentTemp,
    temperature: targetTemp,
    fan_mode: speed,
    fan_modes: availableSpeeds,
  } = attributes;

  const currentTempStr = currentTemp
    ? formatNumericValue(currentTemp, "°C", 0)
    : null;

  const targetTempStr = targetTemp
    ? formatNumericValue(targetTemp, "°C", 0)
    : null;

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
                <Button
                  size="small"
                  onClick={(e) => {
                    showMenu({
                      mouseEvent: e.nativeEvent,
                      clickAnchor: true,
                      title: "Temperatura",
                      options: [16, 21, 30].map((temp) => ({
                        label: `${temp}°C`,
                        onClick: makeServiceCall("climate", "set_temperature", {
                          entity_id: entityId,
                          temperature: temp,
                        }),
                      })),
                    });
                  }}
                >
                  {targetTempStr}
                </Button>
                <Button
                  size="small"
                  onClick={(e) => {
                    showMenu({
                      mouseEvent: e.nativeEvent,
                      clickAnchor: true,
                      title: "Velocidade",
                      options: availableSpeeds.map((speed: string) => ({
                        label: getSpeedLabels(speed),
                        onClick: makeServiceCall("climate", "set_fan_mode", {
                          entity_id: entityId,
                          fan_mode: speed,
                        }),
                      })),
                    });
                  }}
                >
                  {getSpeedLabels(speed)}
                </Button>
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
