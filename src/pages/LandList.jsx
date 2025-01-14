import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const LandList = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token is missing. Please log in again.");
        }

        const response = await fetch("https://recordabackend.onrender.com/api/land/list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Unauthorized. Please log in again.");
          }
          throw new Error(
            `Failed to fetch land listings: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setLands(data);
        setFilteredLands(data); // Initialize filtered lands
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  useEffect(() => {
    const locationParam = searchParams.get("location");
    const queryParam = searchParams.get("q");

    // Filter lands by location and/or query
    let updatedFilteredLands = lands;

    if (locationParam) {
      updatedFilteredLands = updatedFilteredLands.filter(
        (land) => land.location === locationParam
      );
    }

    if (queryParam) {
      updatedFilteredLands = updatedFilteredLands.filter((land) =>
        land.title.toLowerCase().includes(queryParam.toLowerCase())
      );
    }

    setFilteredLands(updatedFilteredLands);
  }, [searchParams, lands]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <span className="badge bg-success">Available</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "sold":
        return <span className="badge bg-danger">Sold</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const handleLandClick = (land) => {
    if (land.status === "available") {
      navigate("/transaction/upload", {
        state: { land: { id: land.id, price: land.price } },
      });
    } else {
      navigate(`/transactions/${land.id}`);
    }
  };

  const handleAddLandClick = () => {
    navigate("/lands/upload");
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading land listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Land Listings</h1>

      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ flexWrap: "wrap" }}
      >
        <button
          className="btn btn-primary"
          onClick={handleAddLandClick}
          style={{ marginBottom: "10px" }}
        >
          Add New Land
        </button>
        <p className="text-muted text-end" style={{ marginBottom: "10px" }}>
          Showing {filteredLands.length} results
        </p>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="text-nowrap">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Size</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLands.map((land, index) => (
              <tr
                key={land.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleLandClick(land)}
              >
                <td>{index + 1}</td>
                <td>{land.title}</td>
                <td>{land.location}</td>
                <td>{land.size}</td>
                <td>₦{land.price.toLocaleString()}</td>
                <td>{getStatusBadge(land.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLands.length === 0 && (
          <p className="text-center">No lands match your filter criteria.</p>
        )}
      </div>
    </div>
  );
};

export default LandList;

