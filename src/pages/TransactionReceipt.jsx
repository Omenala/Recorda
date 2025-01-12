import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TransactionReceipt = () => {
  const { transaction_Id } = useParams(); // Get transaction ID from URL
  console.log("Params:", useParams());
  console.log("Transaction ID:", transaction_Id);

  const [transaction, setTransaction] = useState(null);
  const [land, setLand] = useState(null); // State to store land details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("Authorization token not found");
    }
    return token;
  };

  useEffect(() => {
    const fetchTransactionReceipt = async (id) => {
      try {
        const token = getToken();
        if (!token) {
          setError("Authorization token is missing. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch transaction details
        const response = await axios.get(
          `http://127.0.0.1:8000/api/transaction/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const transactionData = response.data;
        setTransaction(transactionData);

        // Fetch land details using landId from the transaction
        if (transactionData.land) {
          const landResponse = await axios.get(
            `http://127.0.0.1:8000/api/land/${transactionData.land}/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setLand(landResponse.data);
        } else {
          setError("Land details not found.");
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError(
          err.response?.data?.error || "Failed to fetch transaction receipt. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (transaction_Id) {
      fetchTransactionReceipt(transaction_Id);
    } else {
      setError("Transaction ID is missing from the URL.");
      setLoading(false);
    }
  }, [transaction_Id]);

  const handlePrint = () => {
    window.print(); // Opens the print dialog
  };

  if (loading) return <div className="text-center">Loading transaction details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!transaction) return <div className="text-center">No transaction details available.</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Transaction Receipt</h2>
      <div id="receipt-content">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Transaction ID</th>
              <td>{transaction.transaction_id}</td>
            </tr>
            <tr>
              <th>Land Title</th>
              <td>{land ? land.title : "Loading land title..."}</td>
            </tr>
            <tr>
              <th>Client Name</th>
              <td>{transaction.buyer_name || "N/A"}</td>
            </tr>
            <tr>
              <th>Price</th>
              <td>₦{transaction.amount?.toLocaleString() || "0"}</td>
            </tr>
            <tr>
              <th>Amount Paid</th>
              <td>₦{transaction.amount_paid?.toLocaleString() || "0"}</td>
            </tr>
            <tr>
              <th>Balance</th>
              <td>₦{transaction.balance?.toLocaleString() || "0"}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{transaction.status || "Unknown"}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : "N/A"}</td>
            </tr>
            <tr>
              <th>Time</th>
              <td>{transaction.time || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button className="btn btn-secondary" onClick={handlePrint}>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default TransactionReceipt;
