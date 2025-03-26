import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // We'll use `useNavigate` for redirection
import { Eye, EyeOff } from "lucide-react"; // Importing Eye and EyeOff icons from Lucide

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return alert("Please fill in all fields");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", formData);
     

      if (response.status === 200) {
        // Store token, username, and role in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.data.name);
        localStorage.setItem("role", response.data.data.role);
        localStorage.setItem('userId', response.data.data._id); // Store user role

        alert("Login successful");

        // Redirect based on role
        if (response.data.data.role === "admin") {
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        } else {
          navigate("/home"); // Redirect to the home page for regular users
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle the state
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-600" /> // EyeOff icon when password is visible
                ) : (
                  <Eye size={20} className="text-gray-600" /> // Eye icon when password is hidden
                )}
              </button>
            </div>
          </div>
          <span className="block text-center text-gray-600">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </span>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
