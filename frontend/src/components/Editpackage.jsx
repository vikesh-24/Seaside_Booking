import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState({
    title: "",
    description: "",
    price: "",
    capacity: "",
    availableDates: [],
    status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
      const data = response.data.data;
      setPkg({
        ...data,
        availableDates: data.availableDates.map(date => new Date(date).toISOString().split('T')[0]),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching package:", error);
      setError("Failed to fetch package details. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/packages/edit/${id}`, pkg);
      navigate("/packages");
    } catch (error) {
      console.error("Error updating package:", error);
      setError("Failed to update package. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg((prevPkg) => ({
      ...prevPkg,
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
          <button onClick={() => navigate("/packagelist")} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">Back to Packages</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Package</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title:</label>
            <input type="text" name="title" value={pkg.title} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Description:</label>
            <textarea name="description" value={pkg.description} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Price:</label>
            <input type="number" name="price" value={pkg.price} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Capacity:</label>
            <input type="number" name="capacity" value={pkg.capacity} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Available Dates:</label>
            <input type="date" name="availableDates" value={pkg.availableDates} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white" multiple />
          </div>
          <div>
            <label className="block text-sm font-medium">Status:</label>
            <select name="status" value={pkg.status} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-700 text-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-brown-500 py-2 text-white rounded-md hover:bg-brown-700 transition">Update Package</button>
        </form>
      </div>
    </div>
  );
};

export default EditPackage;
