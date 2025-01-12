import React from "react";

const LocationFilter = ({ locations, onSelectLocation }) => {
  // Group locations by the first letter of the location name
  const groupLocations = () => {
    const grouped = {};

    locations.forEach((location) => {
      const firstLetter = location.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(location);
    });

    // Sort each group alphabetically
    for (let key in grouped) {
      grouped[key].sort();
    }

    return grouped;
  };

  const groupedLocations = groupLocations();

  return (
    <div className="location-filter">
      <h2>Filter by Location</h2>
      <div>
        {Object.keys(groupedLocations).map((letter) => (
          <div key={letter}>
            <h4>{letter}</h4>
            <ul>
              {groupedLocations[letter].map((location, index) => (
                <li
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectLocation(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;
