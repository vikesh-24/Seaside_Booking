import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    firstname: "",
    lastname: "",
    role: "",
    leave: "",
    salary: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // First Name Validation
    if (!staff.firstname.trim()) {
      newErrors.firstname = "First name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(staff.firstname)) {
      newErrors.firstname = "First name should contain only letters and be between 2-50 characters";
    }

    // Last Name Validation
    if (!staff.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(staff.lastname)) {
      newErrors.lastname = "Last name should contain only letters and be between 2-50 characters";
    }

    // Role Validation
    if (!staff.role.trim()) {
      newErrors.role = "Role is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(staff.role)) {
      newErrors.role = "Role should contain only letters and be between 2-50 characters";
    }

    // Leave Type Validation
    if (!staff.leave.trim()) {
      newErrors.leave = "Leave type is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(staff.leave)) {
      newErrors.leave = "Leave type should contain only letters and be between 2-50 characters";
    }

    // Salary Validation
    if (!staff.salary) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(staff.salary)) {
      newErrors.salary = "Salary must be a number";
    } else if (staff.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    } else if (staff.salary > 1000000) {
      newErrors.salary = "Salary cannot exceed 1,000,000";
    }

    // Mobile Number Validation
    if (!staff.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(staff.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    } else if (!/^0[1-9][0-9]{8}$/.test(staff.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must start with 0 and be a valid Sri Lankan number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Input sanitization
    let sanitizedValue = value;
    
    if (name === "firstname" || name === "lastname" || name === "role" || name === "leave") {
      // Only allow letters and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === "mobileNumber") {
      // Only allow numbers
      sanitizedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      sanitizedValue = sanitizedValue.slice(0, 10);
    } else if (name === "salary") {
      // Only allow numbers and decimal point
      sanitizedValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limit to 2 decimal places
      if (parts.length === 2) {
        sanitizedValue = parts[0] + '.' + parts[1].slice(0, 2);
      }
    }

    setStaff({ ...staff, [name]: sanitizedValue });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/staffs/add", staff);
      if (response.status === 201) {
        alert("Staff added successfully!");
        navigate("/staff-list");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Error adding staff. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Add New Staff Member</h2>
          <p className="mt-2 text-sm text-gray-600">Please fill in the details below to add a new staff member</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={staff.firstname}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.firstname ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                  maxLength="50"
                />
                {errors.firstname && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={staff.lastname}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.lastname ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                  maxLength="50"
                />
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={staff.role}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.role ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter role"
                  maxLength="50"
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <div>
                <label htmlFor="leave" className="block text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <input
                  type="text"
                  id="leave"
                  name="leave"
                  value={staff.leave}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.leave ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter leave type"
                  maxLength="50"
                />
                {errors.leave && (
                  <p className="mt-1 text-sm text-red-600">{errors.leave}</p>
                )}
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">LKR</span>
                  </div>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={staff.salary}
                    onChange={handleChange}
                    className={`block w-full pl-12 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.salary ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                )}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={staff.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.mobileNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/staff-list")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Staff"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
