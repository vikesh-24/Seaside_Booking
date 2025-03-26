import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState({
    type: "Income", 
    date: "",
    details: "",
    amount: "",
    status: "Completed", 
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transaction/${id}`);
      const data = response.data.data;
      setTransaction({
        type: data.type,
        date: new Date(data.date).toISOString().split('T')[0], 
        details: data.details,
        amount: data.amount,
        status: data.status,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Failed to fetch transaction details. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/transaction/edit/${id}`, transaction);
      navigate("/transactionList");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setError("Failed to update transaction. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-red-500 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/transactions")} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">Back to Transactions</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium">Type:</label>
            <select
              name="type"
              value={transaction.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium">Date:</label>
            <input
              type="date"
              name="date"
              value={transaction.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium">Details:</label>
            <textarea
              name="details"
              value={transaction.details}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            ></textarea>
          </div>

          
          <div>
            <label className="block text-sm font-medium">Amount:</label>
            <input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium">Status:</label>
            <select
              name="status"
              value={transaction.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          
          <button type="submit" className="w-full bg-brown-500 py-2 text-white rounded-md hover:bg-brown-700 transition">Update Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
