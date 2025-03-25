import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/leave/apply", formData);
      alert("Leave request submitted successfully");
      navigate("/admin/leave-requests");
    } catch (error) {
      alert("Error submitting leave request");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-600 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-black-600 mb-6">Apply for Leave</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-700 font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Role</label>
            <input
              type="text"
              name="role"
              placeholder="Enter your role"
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Start Date</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">End Date</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Reason</label>
            <textarea
              name="reason"
              placeholder="Explain your reason for leave..."
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-400 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
