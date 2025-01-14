import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function TransactionHistory() {
    const { landId } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [land, setLand] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("auth_token");

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError("Authorization token is missing. Please log in.");
            setLoading(false);
            return;
        }

        Promise.all([
            axios.get(`https://recordabackend.onrender.com/api/land/${landId}/transactions/`, {
                headers: { Authorization: `Token ${token}` },
            }),
            axios.get(`https://recordabackend.onrender.com/api/land/${landId}/`, {
                headers: { Authorization: `Token ${token}` },
            }),
        ])
            .then(([transactionsResponse, landResponse]) => {
                const data = transactionsResponse.data;
                if (Array.isArray(data)) {
                    setTransactions(data);
                } else if (data.results && Array.isArray(data.results)) {
                    setTransactions(data.results);
                } else {
                    setError("Unexpected data format received from the server.");
                }
                setLand(landResponse.data);
            })
            .catch((err) => {
                setError(err.response?.data?.detail || "Error fetching transactions or land details.");
            })
            .finally(() => setLoading(false));
    }, [landId]);

    const handleRowClick = (transactionId) => {
        navigate(`/transaction/${transactionId}`);
    };

    const handleAddNewTransaction = () => {
        if (land) {
            navigate("/transaction/upload", { state: { land } });
        } else {
            alert("Land details not found for this transaction.");
        }
    };

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container my-4">
            <h1 className="mb-4 text-center">Transaction History</h1>

            <div className="mb-3 text-center">
                <button className="btn btn-primary btn-lg" onClick={handleAddNewTransaction}>
                    Add New Transaction
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Transaction ID</th>
                            <th scope="col">Land Title</th>
                            <th scope="col">Buyer Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Amount Paid</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                onClick={() => handleRowClick(transaction.transaction_id)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{transaction.transaction_id}</td>
                                <td>{land ? land.title : "Loading land title..."}</td>
                                <td>{transaction.buyer_name || "N/A"}</td>
                                <td>₦{transaction.amount?.toLocaleString() || "0"}</td>
                                <td>₦{transaction.amount_paid?.toLocaleString() || "0"}</td>
                                <td>₦{transaction.balance?.toLocaleString() || "0"}</td>
                                <td>{transaction.status || "Unknown"}</td>
                                <td>
                                    {transaction.date
                                        ? new Date(transaction.date).toLocaleDateString()
                                        : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionHistory;
