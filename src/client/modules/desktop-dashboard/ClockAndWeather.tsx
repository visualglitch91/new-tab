import { useEffect, useState } from "react";
import { styled } from "@mui/joy";
import Paper from "../../components/Paper";
import {
  WEATHER_ICONS,
  WeatherEntity,
} from "../../components/WeatherInfo/utils";
import { useEntity } from "../../utils/hass";
import Icon from "../../components/Icon";
import { formatNumericValue } from "../../utils/general";

const Root = styled(Paper)({
  textAlign: "left",
  flexDirection: "row",
  padding: 24,
});

const Time = styled("div")({
  fontSize: "42px",
  marginBottom: "0px",
  lineHeight: 1,
  margintTop: "-4px",
  fontWeight: "500",
});

const DateTime = styled("div")({
  display: "flex",
  flexDirection: "column",
  letterSpacing: "-0.4px",
  rowGap: "12px",
  flex: 1,
});

const Weather = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "4px",
  fontSize: "18px",
  alignItems: "center",
});

const FullDate = styled("div")({
  fontSize: "16px",
  letterSpacing: "-0.2px",
});

function getCurrentTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function ClockAndWeather() {
  const [date, setDate] = useState(() => new Date());
  const weatherEntity = useEntity<WeatherEntity>("weather.republica");

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(() => new Date());
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Root>
      <DateTime>
        <Time>{getCurrentTime(date)}</Time>
        <FullDate>
          {date
            .toLocaleDateString("pt-br", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
            .replace("-feira", "")}
        </FullDate>
      </DateTime>

      {weatherEntity && weatherEntity.attributes && (
        <Weather>
          <Icon icon={WEATHER_ICONS[weatherEntity.state]} size={48} />
          <span>
            {formatNumericValue(weatherEntity.attributes.temperature, "°C", 0)}
          </span>
        </Weather>
      )}
    </Root>
  );
}
