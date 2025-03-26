import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct usage

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/packages/all");
      if (response.data.data && Array.isArray(response.data.data)) {
        setPackages(response.data.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/delete/${id}`);
        setPackages(packages.filter((pkg) => pkg._id !== id));
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package. Please try again.");
      }
    }
  };

  const handleReportGeneration = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Package Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = ["Title", "Description", "Status", "Price", "Capacity", "Available Dates"];
    const tableRows = [];

    packages.forEach(pkg => {
      const pkgData = [
        pkg.title,
        pkg.description,
        pkg.status,
        `$${pkg.price}`,
        `${pkg.capacity} people`,
        pkg.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")
      ];
      tableRows.push(pkgData);
    });

    autoTable(doc, { // ✅ Correct way to use autoTable
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
    });

    doc.save("package-report.pdf");
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-white">Package List</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by title..."
              className="px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="px-4 py-2 bg-brown-600 text-white font-semibold rounded-lg shadow-md hover:bg-brown-700 transition"
              onClick={() => navigate('/add')}>
              ➕ Add Package
            </button>
            <button
              onClick={handleReportGeneration}
              className="px-4 py-2 bg-brown-600 text-white font-semibold rounded-lg shadow-md hover:bg-brown-700 transition"
            >
              📄 Generate Report
            </button>
          </div>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-gray-900 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow border border-gray-700 text-white"
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
                <p className="text-sm text-gray-500">
                  Available Dates: {pkg.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}
                </p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(pkg._id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-brown-500 rounded-lg shadow-md hover:bg-brown-700 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">No packages found</p>
        )}
      </div>
    </div>
  );
};

export default PackageList;
