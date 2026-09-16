import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import { useState } from "react";
import { getWeatherInfo } from "../assets/utils/weatherCode";

const WheatherApp = () => {
  const [location, setLocation] = useState("");

  const handleInputChanges = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(location);
    }
  };

  const weatherImages = {
    sunny,
    cloudy,
    rainy,
    snowy,
  };

  const [data, setData] = useState(null);

  const weatherInfo = data ? getWeatherInfo(data.weatherCode) : null;

  const weatherImage = weatherInfo ? weatherImages[weatherInfo.type] : sunny;

  const getCoordinates = async (city) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

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

  const getWeather = async (latitude, longitude) => {
    const currentFields = [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentFields}&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const result = await response.json();

    return result.current;
  };

  const search = async (city) => {
    const normalizedCity = city.trim();

    if (!normalizedCity) {
      return;
    }

    try {
      const coordinates = await getCoordinates(normalizedCity);

      if (!coordinates) {
        console.log("City not found");
        return;
      }

      const currentWeather = await getWeather(
        coordinates.latitude,
        coordinates.longitude,
      );

      setData({
        city: coordinates.name,
        country: coordinates.country,
        temperature: currentWeather.temperature_2m,
        humidity: currentWeather.relative_humidity_2m,
        windSpeed: currentWeather.wind_speed_10m,
        weatherCode: currentWeather.weather_code,
        time: currentWeather.time,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return "";
    }

    const date = new Date(dateTime);

    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <div className="container">
      <div className="weather-app">
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data ? data.city : "Search a city"}</div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChanges}
              onKeyDown={handleKeyDown}
            />

            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>
          </div>
        </div>

        <div className="weather">
          <img src={weatherImage} alt={weatherInfo?.description || "Weather"} />
          <div className="weather-type">
            {weatherInfo ? weatherInfo.description : "--"}
          </div>
          <div className="temp">
            {data ? `${Math.round(data.temperature)}°` : "--"}
          </div>
        </div>

        <div className="weather-date">
          <p>{data ? formatDate(data.time) : ""}</p>
        </div>

        <div className="weather-data">
          <div className="humidity">
            <div className="data-name">Humidity</div>
            <i className="fa-solid fa-droplet"></i>
            <div className="data">{data ? `${data.humidity}%` : "--"}</div>
          </div>

          <div className="wind">
            <div className="data-name">Wind</div>
            <i className="fa-solid fa-wind"></i>
            <div className="data">{data ? `${data.windSpeed} km/h` : "--"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheatherApp;
