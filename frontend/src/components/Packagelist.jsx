import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookingForm from "./BookingForm";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/packages/all");
      if (response.data.data && Array.isArray(response.data.data)) {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);  // Select the package
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Package List</h2>
          <button 
            className="px-4 py-2 bg-brown-600 text-white font-semibold rounded-lg shadow-md hover:bg-brown-700 transition"
            onClick={() => navigate('/add')}>
            ➕ Add Package
          </button>
        </div>

        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-gray-900 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow border border-gray-700 text-white"
                onClick={() => handleSelectPackage(pkg)} // Select the package
              >
                <h3 className="text-xl font-semibold text-brown-400">{pkg.title}</h3>
                <p className="mt-2 text-gray-400">{pkg.description}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Status: <span className="font-medium text-brown-300">{pkg.status}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Price: <span className="font-medium text-green-400">${pkg.price}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Capacity: {pkg.capacity} people
                </p>

                {/* Selected Package Indicator */}
                {selectedPackage && selectedPackage._id === pkg._id && (
                  <p className="mt-2 text-sm text-green-400">Package selected!</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">No packages found</p>
        )}
        
        {/* Show Booking Form if a package is selected */}
        {selectedPackage && <BookingForm selectedPackage={selectedPackage} />}
      </div>
    </div>
  );
};

export default PackageList;
