export const WEATHER_ICONS = {
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

type WeatherCondition = keyof typeof WEATHER_ICONS;

export interface WeatherEntity {
  state: WeatherCondition;
  attributes: {
    temperature: number;
    forecast: WeatherForecast[];
  };
}

export interface WeatherForecast {
  templow: number;
  apparent_temperature: number;
  temperature: number;
  precipitation_probability: number;
  condition: WeatherCondition;
}
