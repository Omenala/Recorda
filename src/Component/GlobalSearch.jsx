import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GlobalSearch() {
  const [query, setQuery] = useState(''); // Search query
  const [suggestions, setSuggestions] = useState([]); // Search suggestions
  const [results, setResults] = useState([]); // Filtered results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const token = localStorage.getItem('auth_token'); // Assuming the token is stored in localStorage

  // Fetch keyword suggestions while typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/search/lobal-search/', {
          params: { q: query },
          headers: {
            Authorization: `Token ${token}`, // Include token in headers
          },
        });
        setSuggestions(response.data?.suggestions || []);
      } catch (err) {
        setError('Failed to fetch suggestions.');
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchSuggestions, 300); // Debounce input
    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount
  }, [query, token]);

  // Fetch search results on Enter or button click
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/search/global-search/', {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setResults(response.data?.results || []);
    } catch (err) {
      setError('Failed to fetch search results.');
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="global-search-container" style={{ position: 'relative' }}>
      {/* Search Bar */}
      <div className="d-flex align-items-center" style={{ width: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter
        />
        <button className="btn btn-light ms-2" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {/* Suggestions Popup */}
      {query && suggestions.length > 0 && (
        <div
          className="suggestions-popup"
          style={{
            position: 'absolute',
            top: '45px',
            left: 0,
            width: '500px',
            color:'black',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '10px',
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{ padding: '5px 0', cursor: 'pointer' }}
                onClick={() => setQuery(suggestion)} // Set query to clicked suggestion
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Results Popup */}
      {results.length > 0 && (
        <div
          className="search-results"
          style={{
            marginTop: '20px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
          }}
        >
          <h5>Search Results:</h5>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {results.map((result, index) => (
              <li
                key={index}
                style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}
              >
                <strong>{result.title || result.name}</strong> - {result.description || result.location}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default GlobalSearch;
