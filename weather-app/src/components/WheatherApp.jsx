import { useState } from "react";
import { getWeatherInfo } from "../assets/utils/weatherCode";
import { getCoordinates, getCurrentWeather } from "../services/weatherService";
import { formatDate } from "../utils/formatDate";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import WeatherDetails from "./WeatherDetails";
import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";

const weatherImages = {
  sunny,
  cloudy,
  rainy,
  snowy,
};

const WheatherApp = () => {
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);

  const weatherInfo = data ? getWeatherInfo(data.weatherCode) : null;
  const weatherImage = weatherInfo ? weatherImages[weatherInfo.type] : sunny;

  const handleInputChanges = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(location);
    }
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

      const currentWeather = await getCurrentWeather(
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

  return (
    <div className="container">
      <div className="weather-app">
        <SearchBar
          city={data?.city}
          location={location}
          onChange={handleInputChanges}
          onKeyDown={handleKeyDown}
          onSearch={() => search(location)}
        />

        {data ? (
          <WeatherCard
            image={weatherImage}
            description={weatherInfo.description}
            temperature={data.temperature}
          />
        ) : (
          <div className="weather">
            <img src={sunny} alt="Weather" />
            <div className="weather-type">--</div>
            <div className="temp">--</div>
          </div>
        )}

        <div className="weather-date">
          <p>{data ? formatDate(data.time) : ""}</p>
        </div>

        {data ? (
          <WeatherDetails humidity={data.humidity} windSpeed={data.windSpeed} />
        ) : (
          <div className="weather-data">
            <div className="humidity">
              <div className="data-name">Humidity</div>
              <i className="fa-solid fa-droplet"></i>
              <div className="data">--</div>
            </div>

            <div className="wind">
              <div className="data-name">Wind</div>
              <i className="fa-solid fa-wind"></i>
              <div className="data">--</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheatherApp;