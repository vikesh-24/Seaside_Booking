import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF

function BookingAnalysis() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/'); // Adjust the API endpoint
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Handle deleting a booking
  const handleDelete = async (date) => {
    try {
      await axios.delete(`/api/bookings/${date}`); // Adjust the API endpoint
      setBookings(bookings.filter(booking => booking.date !== date));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  // Handle updating a booking (for simplicity, let's just update the adventureName)
  const handleUpdate = async (date) => {
    const updatedAdventureName = prompt('Enter new adventure name:'); // You can create a form for this

    if (updatedAdventureName) {
      try {
        const updatedBooking = { adventureName: updatedAdventureName };
        await axios.put(`/api/bookings/${date}`, updatedBooking); // Adjust the API endpoint
        setBookings(bookings.map(booking => booking.date === date ? { ...booking, adventureName: updatedAdventureName } : booking));
      } catch (error) {
        console.error('Error updating booking:', error);
      }
    }
  };

  // Handle report generation with jsPDF
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Booking Report', 20, 20);

    // Add table headers
    doc.setFontSize(12);
    doc.text('Date', 20, 30);
    doc.text('Adventure Name', 60, 30);
    doc.text('Payment Method', 120, 30);
    doc.text('Total Price', 180, 30);

    // Add booking data to the PDF
    bookings.forEach((booking, index) => {
      const y = 40 + index * 10;
      doc.text(booking.date, 20, y);
      doc.text(booking.adventureName, 60, y);
      doc.text(booking.paymentMethod, 120, y);
      doc.text(booking.totalPrice.toString(), 180, y);
    });

    // Save the generated PDF
    doc.save('booking_report.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Booking Analysis</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div>
          <button 
            onClick={generateReport} 
            className="btn btn-primary mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Generate Report
          </button>

          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Adventure Name</th>
                <th className="px-4 py-2 text-left">Payment Method</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.date} className="border-b">
                  <td className="px-4 py-2">{booking.date}</td>
                  <td className="px-4 py-2">{booking.adventureName}</td>
                  <td className="px-4 py-2">{booking.paymentMethod}</td>
                  <td className="px-4 py-2">{booking.totalPrice}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleUpdate(booking.date)} 
                      className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => handleDelete(booking.date)} 
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingAnalysis;
