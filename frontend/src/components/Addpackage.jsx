import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPackage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [status, setStatus] = useState('Active');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        title,
        description,
        price: Number(price),
        capacity: Number(capacity),
        availableDates: [new Date(availableDate)], // storing a single date in an array
        status,
      };

      const response = await fetch('http://localhost:5000/api/packages/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        throw new Error('Failed to add package');
      }

      console.log('Package added successfully');

      // Reset the form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setCapacity('');
      setAvailableDate('');
      setStatus('Active');

      navigate('/packages');
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Add Package</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-lg font-medium">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-medium">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Capacity:</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Available Date:</label>
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-grey-950 text-white text-lg font-semibold rounded-md hover:bg-black transition"
          >
            Add Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;
