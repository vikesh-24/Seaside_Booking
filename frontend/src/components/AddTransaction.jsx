import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [type, setType] = useState('Income'); 
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        type,
        date: new Date(date), 
        details,
        amount: Number(amount), 
      };

      const response = await fetch('http://localhost:5000/api/transaction/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      console.log('Transaction added successfully');

      
      setType('Income');
      setDate('');
      setDetails('');
      setAmount('');

      navigate('/transactions'); 
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-lg font-medium">Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            >
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          
          
          <div>
            <label className="block text-lg font-medium">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          
          
          <div>
            <label className="block text-lg font-medium">Details:</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            ></textarea>
          </div>
          
          
          <div>
            <label className="block text-lg font-medium">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          
          
          <button
            type="submit"
            className="w-full h-12 bg-grey-950 text-white text-lg font-semibold rounded-md hover:bg-black transition"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
