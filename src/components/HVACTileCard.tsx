import { Button, Stack } from "@mui/material";
import { makeServiceCall, useEntity } from "$app/utils/hass";
import { stopClickPropagation } from "$app/utils/general";
import { useMenu } from "$app/utils/useMenu";
import BaseTileCard from "./BaseTileCard";

const speeds = ["Baixo", "Medio", "Alto", "Turbo"];
const temps = ["Ventilar", "16", "21", "30"];

const defaultTemp = "16";
const defaultSpeed = "Turbo";

export default function HVACTileCard({
  statusEntityId,
  turnOffButtonEntityId,
  getButtonEntityId,
}: {
  statusEntityId: string;
  turnOffButtonEntityId: string;
  getButtonEntityId: (speed: string, temp: string) => string;
}) {
  const showMenu = useMenu();

  let { state: status = "Desligado" } = useEntity(statusEntityId) || {};

  if (status === "unknown") {
    status = "Desligado";
  }

  const on = status !== "Desligado";
  const temp = on ? status.split(" / ")[0].replaceAll("°C", "") : defaultTemp;
  const tempStr = isNaN(Number(temp)) ? temp : `${temp}°C`;
  const speed = on ? status.split(" / ")[1] : defaultSpeed;

  return (
    <BaseTileCard
      active={on}
      onClick={makeServiceCall("button", "press", {
        entity_id: on
          ? turnOffButtonEntityId
          : getButtonEntityId(defaultSpeed, defaultTemp),
      })}
      primaryText="Ar-Condicionado"
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
                  options: temps.map((temp) => ({
                    label: isNaN(Number(temp)) ? temp : `${temp}°C`,
                    onClick: makeServiceCall("button", "press", {
                      entity_id: getButtonEntityId(speed, temp),
                    }),
                  })),
                });
              }}
            >
              {tempStr}
            </Button>
            <Button
              size="small"
              sx={{ minWidth: 0, height: 24 }}
              onClick={(e) => {
                showMenu({
                  mouseEvent: e.nativeEvent,
                  clickAnchor: true,
                  title: "Velocidade",
                  options: speeds.map((speed: string) => ({
                    label: speed,
                    onClick: makeServiceCall("button", "press", {
                      entity_id: getButtonEntityId(speed, temp),
                    }),
                  })),
                });
              }}
            >
              {speed}
            </Button>
          </Stack>
        ) : null
      }
    />
  );
}
