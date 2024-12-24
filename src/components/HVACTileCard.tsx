import { Button, Stack } from "@mui/material";
import { callService, makeServiceCall, useEntity } from "$app/utils/hass";
import { formatNumericValue, stopClickPropagation } from "$app/utils/general";
import { useMenu } from "$app/utils/useMenu";
import BaseTileCard from "./BaseTileCard";

function getSpeedLabels(speed: string) {
  return { low: "Fraco", medium: "Médio", high: "Forte" }[speed] || speed;
}

export default function HVACTileCard({ entityId }: { entityId: string }) {
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
    <BaseTileCard
      active={on}
      onClick={() => {
        callService("climate", !on ? "turn_on" : "turn_off", {
          entity_id: entityId,
        });
      }}
      primaryText="Ar-Condicionado"
      secondaryText={
        on ? (
          <>
            {currentTemp &&
            targetTemp &&
            Math.abs(currentTemp - targetTemp) < 0.7
              ? targetTempStr
              : [currentTempStr, targetTempStr].filter(Boolean).join(" › ")}
          </>
        ) : null
      }
      icon="mdi:snowflake-thermometer"
      endSlot={
        on ? (
          <Stack
            gap={1}
            direction="row"
            alignItems="center"
            {...stopClickPropagation()}
          >
            <Button
              size="small"
              sx={{ minWidth: 0, height: 24 }}
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
              sx={{ minWidth: 0, height: 24 }}
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
          </Stack>
        ) : null
      }
    />
  );
}
