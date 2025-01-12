import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("auth_token"); // Get the token from localStorage

      if (!token) {
        setError("Authorization token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/transaction/list-transactions/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`, // Add token to the Authorization header
            },
          }
        );
        setTransactions(response.data); // Set the transactions from the API response
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("auth_token"); // Remove token from localStorage if session expired
          navigate("/login");
        } else {
          setError("Failed to fetch transactions. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleEdit = (transactionId) => {
    const transaction = transactions.find((txn) => txn.id === transactionId);
    navigate(`/edit-transaction/${transactionId}`, { state: { transaction } });
  };

  const handleDelete = async (transactionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return;
        }

        await axios.delete(
          `http://127.0.0.1:8000/api/transaction/${transaction_Id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setTransactions(transactions.filter((txn) => txn.id !== transactionId));
        alert("Transaction deleted successfully!");
      } catch (error) {
        alert("Failed to delete the transaction.");
      }
    }
  };

  const handleViewReceipt = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  if (loading) {
    return <div className="container mt-4" style={{ fontSize: '16px', color: '#333' }}>Loading transactions...</div>;
  }

  if (error) {
    return <div className="container mt-4 text-danger" style={{ fontSize: '16px' }}>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4" style={{ fontSize: '24px' }}>Transaction Records</h1>
      <table className="table table-striped table-hover">
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Land Title</th>
            <th>Client Name</th>
            <th>Client Phone</th>
            <th>Price</th>
            <th>Amount Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id}
            onClick={() => handleViewReceipt(transaction.transaction_id)}
            style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.land}</td>
              <td>{transaction.buyer_name}</td>
              <td>{transaction.buyer_phone}</td>
              <td>₦{transaction.amount ? transaction.amount.toLocaleString() : "N/A"}</td>
              <td>₦{transaction.amount_paid ? transaction.amount_paid.toLocaleString() : "N/A"}</td>
              <td>₦{transaction.balance ? transaction.balance.toLocaleString() : "N/A"}</td>
              <td>
                {transaction.status === "pending" ? (
                  <span className="badge bg-warning text-dark" style={{ fontSize: '14px' }}>Pending</span>
                ) : transaction.status === "sold" ? (
                  <span className="badge bg-success" style={{ fontSize: '14px' }}>Sold</span>
                ) : (
                  <span className="badge bg-info" style={{ fontSize: '14px' }}>Completed</span>
                )}
              </td>
              <td>{transaction.date}</td>
              <td>{transaction.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end mt-4" style={{ gap: '15px' }}>
        {transactions.map((transaction) => (
          <div key={transaction.id} className="d-flex align-items-center">
            <i
              className="fa fa-edit text-primary me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit(transaction.id)}
              title="Edit Transaction"
            ></i>
            <i
              className="fa fa-trash text-danger me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(transaction.id)}
              title="Delete Transaction"
            ></i>
            <i
              className="fa fa-receipt text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => handleViewReceipt(transaction.id)}
              title="View Receipt"
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
