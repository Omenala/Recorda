import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const TransactionUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const landFromLocation = location.state?.land || null;

  const [formData, setFormData] = useState({
    land: landFromLocation ? landFromLocation.id : "",
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    amount: landFromLocation ? landFromLocation.price : "",
    amount_paid: "",
    balance: "0.00", // Default to 0.00
    status: "pending", // Default status
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (landFromLocation) {
      setFormData((prevState) => ({
        ...prevState,
        land: landFromLocation.id,
      }));
    }
  }, [landFromLocation]);

  // Update the balance dynamically
  useEffect(() => {
    const balance = parseFloat(formData.amount || 0) - parseFloat(formData.amount_paid || 0);
    setFormData((prevState) => ({
      ...prevState,
      balance: balance >= 0 ? balance.toFixed(2) : "0.00", // Non-negative and formatted
    }));
  }, [formData.amount, formData.amount_paid]);

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

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transaction/upload/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log("Uploaded Transaction Details:", response.data);
      alert("Transaction details uploaded successfully!");

      setFormData({
        land: "",
        buyer_name: "",
        buyer_email: "",
        buyer_phone: "",
        amount: "",
        amount_paid: "",
        balance: "0.00",
        status: "pending",
      });
      navigate("/transaction/list");
    } catch (err) {
      console.error("Error uploading transaction details:", err);
      setError(err.response?.data?.detail || "Failed to upload transaction details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-30 bg-light mt-5">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <h2 className="text-center mb-4 text-primary">Upload Transaction Details</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="land" className="form-label">Land ID</label>
            <input
              type="text"
              id="land"
              name="land"
              value={formData.land}
              className="form-control"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="buyer_name" className="form-label">Buyer Name</label>
            <input
              type="text"
              id="buyer_name"
              name="buyer_name"
              value={formData.buyer_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="buyer_email" className="form-label">Buyer Email</label>
            <input
              type="email"
              id="buyer_email"
              name="buyer_email"
              value={formData.buyer_email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="buyer_phone" className="form-label">Buyer Phone</label>
            <input
              type="text"
              id="buyer_phone"
              name="buyer_phone"
              value={formData.buyer_phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Total Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount_paid" className="form-label">Amount Paid</label>
            <input
              type="number"
              id="amount_paid"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="balance" className="form-label">Balance</label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={formData.balance}
              className="form-control"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Uploading..." : "Upload Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionUpload;
