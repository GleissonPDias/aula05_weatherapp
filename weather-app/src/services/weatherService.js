const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const getCoordinates = async (city) => {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }

  const result = await response.json();

  if (!result.results || result.results.length === 0) {
    return null;
  }

  const place = result.results[0];

  return {
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  };
};

export const getCurrentWeather = async (latitude, longitude) => {
  const current = [
    "temperature_2m",
    "relative_humidity_2m",
    "wind_speed_10m",
    "weather_code",
  ].join(",");

  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=${current}&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const result = await response.json();

  return result.current;
};
