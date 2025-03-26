import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "../assets/image.png";
import logo from "../assets/logo.jpg";

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
    checkLoginStatus();
  }, []);

  // Fetch adventure packages from API
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

  // Check if user is logged in (fetch from localStorage)
  const checkLoginStatus = () => {
    const userData = localStorage.getItem("userName");
    if (userData) {
      setUserName(userData);
    } else {
      setUserName(null);
    }
  };

  // Handle logout function
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Update the state
    setUserName(null);
    // Redirect to the home page or login page
    navigate("/login");  // Redirect to login page (or home, depending on your preference)
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center text-center p-6 w-full">
      {/* Header Section */}
      <header className="bg-blue-800 w-full py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-32 h-auto transition-transform transform hover:scale-105" />
          </Link>
          <nav className="space-x-6 text-white text-lg font-semibold flex items-center">
            <Link to="/home" className="hover:text-blue-300 transition">Home</Link>
            <Link to="/about" className="hover:text-blue-300 transition">About</Link>
            <Link to="/packages" className="hover:text-blue-300 transition">Packages</Link>
            
            {/* Show My Bookings if logged in, otherwise Booking */}
            {userName ? (
              <Link to="/my-bookings" className="hover:text-blue-300 transition">My Bookings</Link>
            ) : (
              <Link to="/book-adventure" className="hover:text-blue-300 transition">Booking</Link>
            )}
            
            <Link to="/contact" className="hover:text-blue-300 transition">Contact</Link>

            {/* Show logged-in user's name or Login link */}
            {userName ? (
              <div className="flex items-center space-x-4">
                <span className="text-yellow-300 font-bold">Hi, {userName}!</span>
                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-cover bg-center w-full"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">Welcome</h1>
          <p className="mt-4 text-xl text-gray-100">Discover and book your next adventure with us!</p>
          <div className="mt-6 space-x-4">
            <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105">Get Started</Link>
            <Link to="/about" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition transform hover:scale-105">Learn More</Link>
          </div>
        </div>
      </motion.div>

      {/* Booking Section */}
      <div className='mt-10 bg-blue-700 shadow-lg hover:shadow-xl max-w-2xl min-h-32 flex flex-col gap-5 rounded-lg items-center justify-center p-8'>
        <h1 className='font-serif text-2xl text-white'>Plan Your Next Adventure</h1>
        <Link to={userName ? "/my-bookings" : "/book-adventure"}>
          <button className='bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-full shadow-lg hover:bg-blue-100 transition text-lg'>
            {userName ? "View My Bookings" : "Book Now"}
          </button>
        </Link>
      </div>

      {/* Package List Section */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.5 }}
        className="max-w-6xl mx-auto py-12 px-6 w-full"
      >
        <h2 className="text-4xl font-bold text-blue-800 text-center">Explore Our Packages</h2>
        <p className="text-blue-300 text-center mt-2">Discover and book your next adventure with us.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition"
              >
                <h3 className="text-xl font-semibold text-blue-800">{pkg.title}</h3>
                <p className="mt-2 text-gray-600">{pkg.description}</p>
                <p className="mt-4 text-sm text-gray-500">Status: <span className="font-medium text-blue-500">{pkg.status}</span></p>
                <p className="mt-1 text-sm text-gray-500">Price: <span className="font-medium text-blue-400">${pkg.price}</span></p>
                <p className="text-sm text-gray-500">Capacity: {pkg.capacity} people</p>
                <p className="text-sm text-gray-500">Available Dates: {pkg.availableDates?.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg mt-10">No packages found</p>
          )}
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="bg-blue-800 text-white py-6 mt-12 w-full text-center">
        <p>&copy; 2023 . All Rights Reserved.</p>
        <div className="mt-4">
          <Link to="/privacy" className="hover:text-blue-300 transition">Privacy Policy</Link> | 
          <Link to="/terms" className="hover:text-blue-300 transition"> Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
