import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LocationFilter = () => {
  const [groupedLocations, setGroupedLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token is missing. Please log in again.");
        }

        const response = await fetch("https://recordabackend.onrender.com/api/land/list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch locations.");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Extract unique locations and group them alphabetically
        const uniqueLocations = [...new Set(data.map((land) => land.location))];
        const grouped = uniqueLocations.reduce((acc, location) => {
          const firstLetter = location.charAt(0).toUpperCase();
          if (!acc[firstLetter]) acc[firstLetter] = [];
          acc[firstLetter].push(location);
          return acc;
        }, {});

        // Sort the groups and their contents
        const sortedGrouped = Object.keys(grouped)
          .sort()
          .reduce((acc, key) => {
            acc[key] = grouped[key].sort();
            return acc;
          }, {});

        setGroupedLocations(sortedGrouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (location) => {
    if (location === "All") {
      navigate("/lands/:location");
    } else {
      navigate(`/lands/:location?location=${encodeURIComponent(location)}`);
    }
  };

  if (loading) return <p>Loading locations...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className=" container location-filter">
      <h2>Filter by Location</h2>
      <ul>
        <li
          key="all"
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => handleLocationClick("All")}
        >
          All
        </li>
      </ul>
      {Object.keys(groupedLocations).map((letter) => (
        <div key={letter} className="location-group">
          <h3>{letter}</h3>
          <ul>
            {groupedLocations[letter].map((location, index) => (
              <li
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleLocationClick(location)}
              >
                {location}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LocationFilter;
