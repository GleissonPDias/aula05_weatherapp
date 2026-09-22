const SearchBar = ({ city, location, onChange, onKeyDown, onSearch }) => {
  return (
    <div className="search">
      <div className="search-top">
        <i className="fa-solid fa-location-dot"></i>
        <div className="location">{city || "Search a city"}</div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

        <i className="fa-solid fa-magnifying-glass" onClick={onSearch}></i>
      </div>
    </div>
  );
};

export default SearchBar;
