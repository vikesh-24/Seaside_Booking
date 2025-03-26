import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log("Updated transactions:", transactions);
    calculateTotals(transactions); 
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.details.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [transactions, searchQuery]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transaction/all");
      console.log("Fetched data:", response.data);
      
      if (response.data.data && Array.isArray(response.data.data)) {
        setTransactions(response.data.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateTotals = (transactions) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        income += transaction.amount;
      } else if (transaction.type === "Expense") {
        expense += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);  
  };

  const handleEdit = (id) => {
    navigate(`/editTransaction/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transaction/delete/${id}`);
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add logo image (replace 'logo.jpg' with the path to your image)
    const logoPath = './logo.jpg'; // path to your logo image
    doc.addImage(logoPath, 'JPEG', 14, 8, 30, 30); // x, y, width, height for the image
  
    doc.setFontSize(18);
    doc.text("Transactions Report", 14, 16);
  
    doc.setFontSize(12);
  
    doc.text("Type", 14, 30);
    doc.text("Details", 40, 30);
    doc.text("Amount", 90, 30);
    doc.text("Date", 120, 30);
  
    doc.line(14, 32, 200, 32); 
  
    let yPosition = 40; 
    filteredTransactions.forEach((transaction) => {
      doc.text(transaction.type, 14, yPosition);
      doc.text(transaction.details, 40, yPosition);
      doc.text(`LKR ${transaction.amount}`, 90, yPosition);
      doc.text(new Date(transaction.date).toLocaleDateString(), 120, yPosition);
      yPosition += 10; 
    });
  
    doc.save("transactions_report.pdf");
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-6 flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-xl font-bold">Balance Sheet</h3>
            <p>Total Income: <span className="font-medium text-green-400">LKR {totalIncome}</span></p>
            <p>Total Expense: <span className="font-medium text-red-400">LKR {totalExpense}</span></p>
            <p>Balance: <span className={`font-medium ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>LKR {balance}</span></p>
          </div>
          <button
            className="px-4 py-2 bg-brown-600 text-white font-semibold rounded-lg shadow-md hover:bg-brown-700 transition"
            onClick={() => navigate('/addTransaction')}
          >
            ➕ Add Transaction
          </button>
        </div>

        
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 p-2 bg-gray-700 text-white rounded-md"
          />
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Export PDF Report
          </button>
        </div>

    
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-gray-900 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow border border-gray-700 text-white"
              >
                <h3 className="text-xl font-semibold text-brown-400">{transaction.type}</h3>
                <p className="mt-2 text-gray-400">{transaction.details}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Status: <span className="font-medium text-brown-300">{transaction.status}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Amount: <span className="font-medium text-green-400">${transaction.amount}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(transaction.date).toLocaleDateString()}
                </p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(transaction._id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-brown-500 rounded-lg shadow-md hover:bg-brown-700 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
