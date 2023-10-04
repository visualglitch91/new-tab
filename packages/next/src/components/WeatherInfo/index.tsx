import { styled } from "@mui/material";
import { WEATHER_ICONS, WeatherEntity } from "./utils";
import { useEntity } from "../../utils/hass";
import { formatNumericValue } from "../../utils/general";
import Icon from "../Icon";

const Root = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  fontWeight: 600,

  '&[data-full="true"]': {
    flexDirection: "row",
  },
});

const Info = styled("div")({
  display: "flex",
  flexDirection: "column",
});

export default function WeatherInfo({
  daysFromNow = 0,
  iconSize = 24,
  fontSize = 14,
  gap: gridGap = 4,
  full = false,
}: {
  daysFromNow?: number;
  iconSize?: number;
  fontSize?: number;
  gap?: number;
  full?: boolean;
}) {
  const weather =
    useEntity<WeatherEntity>("weather.republica")?.attributes.forecast?.[
      daysFromNow
    ];

  if (!weather) {
    return null;
  }

  return (
    <Root data-full={full} style={{ gridGap }}>
      <Icon icon={WEATHER_ICONS[weather.condition]} size={iconSize} />
      <Info style={{ fontSize }}>
        {full && <span>{formatNumericValue(weather.templow, "°C", 0)}</span>}
        <span>{formatNumericValue(weather.temperature, "°C", 0)}</span>
      </Info>
    </Root>
  );
}
