import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // for E-Ticket generation

function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setMessage("You need to be logged in to view your bookings.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedBookings = response.data.data || [];
      setBookings(formattedBookings);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch bookings.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      console.error("Error canceling booking:", err.response?.data || err);
    }
  };

  const handleUpdateBooking = async (bookingId) => {
    const newDate = prompt("Enter the new booking date (YYYY-MM-DD):");

    if (!newDate) {
      alert("Date is required to update.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/bookings/update/${bookingId}`, {
        date: newDate,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Booking updated successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err.response?.data || err);
      alert("Failed to update booking.");
    }
  };

  const handleGenerateETicket = (booking) => {
    const doc = new jsPDF();
    doc.text("E-Ticket", 90, 20);
    doc.text(`Package: ${booking.packageName}`, 20, 40);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`, 20, 50);
    doc.text(`Payment Method: ${booking.paymentMethod}`, 20, 60);
    doc.text(`Total Price: ${booking.totalPrice}`, 20, 70);
    doc.text(`Number of People: ${booking.numPeople}`, 20, 80);
    doc.text(`Thank you for booking with us!`, 50, 100);
    doc.save(`E-Ticket_${booking.packageName}.pdf`);
  };

  const isUpdateAllowed = (bookingDate) => {
    const today = new Date();
    const bookingDay = new Date(bookingDate);
    const timeDifference = bookingDay.getTime() - today.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference > 3;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    booking.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center p-6">
      <div className="p-6 max-w-4xl w-full bg-white shadow-lg rounded-3xl border-4 border-blue-300 transition-all transform hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">My Booked Adventures</h2>

        <input
          type="text"
          placeholder="Search by package name..."
          className="mb-6 p-3 border rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {message && <p className="text-center text-red-500">{message}</p>}

        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <ul className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <li
                key={index}
                className="p-4 border rounded-xl shadow flex flex-col md:flex-row justify-between items-center transition-all hover:scale-105 duration-300 ease-in-out space-y-3 md:space-y-0"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{booking.packageName}</h3>
                  <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm">Payment Method: {booking.paymentMethod}</p>
                </div>

                <div className="flex flex-col space-y-2 md:space-x-2 md:flex-row mt-2 md:mt-0">
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Cancel
                  </button>

                  {isUpdateAllowed(booking.date) ? (
                    <button
                      onClick={() => handleUpdateBooking(booking._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Update Disabled
                    </button>
                  )}

                  <button
                    onClick={() => handleGenerateETicket(booking)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    E-Ticket
                  </button>
                </div>
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
