import Icon from "$app/components/Icon";
import { WeatherEntity } from "$app/components/WeatherInfo/utils";
import { useEntity } from "$app/utils/hass";
import { formatNumericValue } from "$app/utils/general";
import Flex from "../components/Flex";

const WEATHER_ICONS = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  exceptional: "alert-circle-outline",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant",
};

export default function Weather() {
  const weatherEntity = useEntity<WeatherEntity>(
    "weather.casa_temperatura_externa"
  );

  return (
    <Flex align="center" gap={0.5}>
      <Icon
        icon={WEATHER_ICONS[weatherEntity?.state || "cloudy"]}
        color="blue"
        size={16}
      />
      {weatherEntity
        ? formatNumericValue(weatherEntity.attributes.temperature, "°C")
        : "Weather unavailable"}
    </Flex>
  );
}
