const WeatherDetails = ({ humidity, windSpeed }) => {
  return (
    <div className="weather-data">
      <div className="humidity">
        <div className="data-name">Humidity</div>
        <i className="fa-solid fa-droplet"></i>
        <div className="data">{humidity}%</div>
      </div>

      <div className="wind">
        <div className="data-name">Wind</div>
        <i className="fa-solid fa-wind"></i>
        <div className="data">{windSpeed} km/h</div>
      </div>
    </div>
  );
};

export default WeatherDetails;