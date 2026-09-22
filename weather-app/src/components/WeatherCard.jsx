const WeatherCard = ({ image, description, temperature }) => {
  return (
    <div className="weather">
      <img src={image} alt={description} />
      <div className="weather-type">{description}</div>
      <div className="temp">{Math.round(temperature)}°</div>
    </div>
  );
};

export default WeatherCard;