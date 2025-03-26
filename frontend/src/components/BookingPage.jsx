import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookingPage() {
  const [bookings, setBookings] = useState([]); // To store fetched bookings
  const [message, setMessage] = useState(""); // To show messages (like errors or success)

  // Fetch bookings function
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You need to be logged in to view your bookings.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Bookings:", response.data.data);

      const formattedBookings = response.data.data || [];
      setBookings(formattedBookings);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch bookings.");
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional: If required for auth
        },
      });
      console.log("Booking canceled:", response.data);
      // Optionally, update your state to reflect the cancellation
      setBookings(bookings.filter(booking => booking._id !== bookingId)); // Remove the canceled booking from UI
    } catch (err) {
      console.error("Error canceling booking:", err.response?.data || err);
      // Optionally, show a message to the user
    }
  };

  useEffect(() => {
    fetchBookings(); // Fetch bookings on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-center items-center">
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-3xl border-4 border-blue-300 transition-all transform hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">My Booked Adventures</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg shadow flex justify-between items-center transition-all hover:scale-105 duration-300 ease-in-out"
              >
                <div>
                  <h3 className="text-lg font-semibold">{booking.packageName}</h3>
                  <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm">Payment Method: {booking.paymentMethod}</p>
                </div>
                <button
                  onClick={() => handleCancelBooking(booking._id)} // Use booking._id for cancellation
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => window.location.href = "/book-adventure"}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Book an Adventure
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
