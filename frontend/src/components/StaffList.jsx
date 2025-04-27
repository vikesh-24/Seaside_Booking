import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/staffs/all");
        setStaffList(response.data.data);
        setFilteredStaff(response.data.data);
        setError(null);
      } catch (error) {
        setError("Error fetching staff list. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffList();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        setIsDeleting(true);
        const response = await axios.delete(`http://localhost:5000/api/staffs/delete/${id}`);
        if (response.status === 200) {
          setStaffList((prevList) => prevList.filter(staff => staff._id !== id));
          setFilteredStaff((prevList) => prevList.filter(staff => staff._id !== id));
          alert("Staff deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        alert("Error deleting staff. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaff(staffList);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredStaff(
        staffList.filter((staff) =>
          staff.firstname.toLowerCase().includes(lowerCaseQuery) ||
          staff.lastname.toLowerCase().includes(lowerCaseQuery) ||
          staff.role.toLowerCase().includes(lowerCaseQuery) ||
          staff.leave.toString().toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, staffList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Staff Members</h2>
            <p className="mt-2 text-sm text-gray-600">Manage your staff members and their details</p>
          </div>
          <Link to="/addstaff" className="mt-4 md:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Staff
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, role, or leave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr key={staff._id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.firstname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.lastname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.leave}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LKR {staff.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/edit-staff/${staff._id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4 transition duration-150"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(staff._id)}
                            disabled={isDeleting}
                            className={`text-red-600 hover:text-red-900 transition duration-150 ${
                              isDeleting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No staff members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;
