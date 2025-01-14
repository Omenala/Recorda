import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/search/global-search/", {
        params: { q: query },
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = response.data.results || [];
      setResults(data);

      if (data.length === 0) {
        setError("No results found for your search.");
      }
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === "land") {
      navigate(`/search/lands/${encodeURIComponent(result.location)}?q=${encodeURIComponent(result.title)}`);
    } else if (result.type === "transaction") {
      navigate(`/transaction/${result.transaction_id}`);
    }
  };

  return (
    <div className="global-search-container">
      {/* Search Input and Button */}
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginBottom: "1rem" }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search lands, transactions, or status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: "1", minWidth: "250px" }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
          style={{ minWidth: "100px" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Display Results */}
      {results.length > 0 && (
        <div className="search-results mt-3">
          <ul className="list-group">
            {results.map((result, index) => (
              <li
                key={index}
                className="list-group-item"
                onClick={() => handleResultClick(result)}
                style={{ cursor: "pointer" }}
              >
                {result.type === "land" ? (
                  <>
                    <strong>Land:</strong> {result.title} - {result.location} <br />
                    <strong>Status:</strong> {result.status}
                  </>
                ) : (
                  <>
                    <strong>Transaction:</strong> ID: {result.transaction_id}, Buyer: {result.buyer_name}, Amount: {result.amount}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error or No Results Message */}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default GlobalSearch;
