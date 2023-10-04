import { useState } from "react";
import { styled } from "@mui/material";
import GlossyPaper from "./GlossyPaper";
import { WEATHER_ICONS, WeatherEntity } from "./WeatherInfo/utils";
import { useEntity } from "../utils/hass";
import Icon from "./Icon";
import { formatNumericValue } from "../utils/general";
import useMountEffect from "../utils/useMountEffect";
import clock from "../utils/clock";
import { SxProps } from "../theme/utils";
import { sxx } from "../utils/styling";

const classes = {
  Time: "ClockAndWeather__Time",
  Weather: "ClockAndWeather__Weather",
};

const Time = styled("div")({
  fontSize: "42px",
  marginBottom: "0px",
  lineHeight: 1,
  fontWeight: 500,
});

const DateTime = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  letterSpacing: "-0.4px",
  rowGap: "12px",
});

const Weather = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "4px",
  fontSize: "18px",
  alignItems: "center",
});

const FullDate = styled("div")({
  marginTop: "auto",
  fontSize: "16px",
  letterSpacing: "-0.2px",
});

const Root = styled(GlossyPaper)({
  textAlign: "left",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: 24,
  fontWeight: "500",
});

const compactSx: SxProps = {
  padding: "10px",
  justifyContent: "space-around",
  [`& .${classes.Time}`]: { fontSize: "38px" },
  [`& .${classes.Weather}`]: {
    rowGap: 0,
    "& > *:first-child": { marginBottom: "-3px" },
  },
};

function getCurrentTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function ClockAndWeather({
  sx,
  compact,
}: {
  sx: SxProps;
  compact?: boolean;
}) {
  const [date, setDate] = useState(() => new Date());
  const weatherEntity = useEntity<WeatherEntity>("weather.republica");

  useMountEffect(() => {
    return clock.on(() => setDate(() => new Date()));
  });

  return (
    <Root sx={sxx(sx, compact && compactSx)}>
      <DateTime>
        <Time className={classes.Time}>{getCurrentTime(date)}</Time>
        {!compact && (
          <FullDate>
            {date
              .toLocaleDateString("pt-br", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
              .replace("-feira", "")}
          </FullDate>
        )}
      </DateTime>

      {weatherEntity && weatherEntity.attributes && (
        <Weather className={classes.Weather}>
          <Icon
            icon={WEATHER_ICONS[weatherEntity.state]}
            size={compact ? 32 : 48}
          />
          <span>
            {formatNumericValue(weatherEntity.attributes.temperature, "°C", 0)}
          </span>
        </Weather>
      )}
    </Root>
  );
}
