import { useState } from "react";
import { styled } from "@mui/material";
import { useEntity } from "$app/utils/hass";
import { formatNumericValue } from "$app/utils/general";
import useMountEffect from "$app/utils/useMountEffect";
import clock from "$app/utils/clock";
import { SxProps } from "$app/theme/utils";
import { sxx } from "$app/utils/styling";
import GlossyPaper from "./GlossyPaper";
import { WEATHER_ICONS, WeatherEntity } from "./WeatherInfo/utils";
import Icon from "./Icon";

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
  backgroundColor: "white !important",
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
  sx?: SxProps;
  compact?: boolean;
}) {
  const [date, setDate] = useState(() => new Date());
  const weatherEntity = useEntity<WeatherEntity>(
    "weather.casa_temperatura_externa"
  );

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
