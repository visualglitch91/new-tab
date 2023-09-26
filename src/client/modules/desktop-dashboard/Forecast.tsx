import { styled } from "@mui/joy";
import Paper from "../../components/Paper";
import WeatherInfo from "../../components/WeatherInfo";

const Root = styled(Paper)({
  padding: 16,
});

const Inner = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  margin: "0 auto",
  width: "100%",
});

const ForecastItemRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
  textAlign: "center",

  "& > span:first-child": {
    fontSize: 16,
    fontWeight: 700,
  },
});

function ForecastItem({ daysFromNow }: { daysFromNow: number }) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);

  return (
    <ForecastItemRoot>
      <span>
        {date.toLocaleDateString("pt-br", { weekday: "short" }).slice(0, -1)}
      </span>
      <WeatherInfo
        full
        daysFromNow={daysFromNow}
        iconSize={32}
        fontSize={13}
        gap={10}
      />
    </ForecastItemRoot>
  );
}

export default function Forecast({ days }: { days: number }) {
  return (
    <Root>
      <Inner sx={{ maxWidth: days * 100 }}>
        {new Array(days).fill(0).map((_, index) => (
          <ForecastItem key={index} daysFromNow={index} />
        ))}
      </Inner>
    </Root>
  );
}
