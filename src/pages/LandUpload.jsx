import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    size: "",
    price: "",
    status: "available",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Input validation
    if (!formData.title || !formData.location || !formData.size || !formData.price) {
      setError("Please fill out all fields before submitting.");
      setLoading(false);
      return;
    }

    if (isNaN(formData.size) || isNaN(formData.price)) {
      setError("Size and price must be valid numbers.");
      setLoading(false);
      return;
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("You are not logged in. Please log in and try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://recordabackend.onrender.com/api/land/upload/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Handle the response from the backend
      const errorData = await response.json();

      if (!response.ok) {
        console.error('Backend error data:', errorData);
        throw new Error(errorData.detail || "Something went wrong. Please try again.");
      }

      // If the request is successful
      setSuccess("Land details uploaded successfully!");

      // Redirect to the lands page with the location
    navigate(`/lands/${formData.location}`);


      // Reset the form
      setFormData({
        title: "",
        location: "",
        size: "",
        price: "",
        status: "available",
      });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light mt-5">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <h2 className="text-center mb-4 text-primary">Upload Land Details</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter land title"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter land location"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="size" className="form-label">
              Size (sqm)
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter size in sqm"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter price"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Uploading..." : "Upload Land"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandUpload; 