import { useState } from "react";
import axios from "axios";

const AddStaff = () => {
  const [staff, setStaff] = useState({
    firstname: "",
    lastname: "",
    role: "",
    leave: "",
    salary: "",
  });

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/staffs/add", staff);
      if (response.status === 201) {
        alert("Staff added successfully!");
        setStaff({ firstname: "", lastname: "", role: "", leave: "", salary: "" });
      } else {
        alert("Failed to add staff. Please try again.");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Error adding staff. Check console for details.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full border border-blue-300">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Add Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="firstname" placeholder="First Name" value={staff.firstname} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input type="text" name="lastname" placeholder="Last Name" value={staff.lastname} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input type="text" name="role" placeholder="Role" value={staff.role} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input type="text" name="leave" placeholder="Leave Type" value={staff.leave} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input type="number" name="salary" placeholder="Salary" value={staff.salary} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300">
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;