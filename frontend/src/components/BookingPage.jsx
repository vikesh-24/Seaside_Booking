import { useEffect, useState } from "react";
import axios from "axios";

const BookingsPage = () => {
    const [bookings, setBookings] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You need to be logged in to view your bookings.");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookings(response.data.bookings);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch bookings.");
        }
    };

    const handleCancelBooking = async (date) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            if (!token) {
                setMessage("You need to be logged in to cancel a booking.");
                return;
            }
    
            const encodedDate = encodeURIComponent(date);

            await axios.delete(`http://localhost:5000/api/bookings?date=${encodedDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("Booking cancelled successfully.");
            setTimeout(fetchBookings, 500); // Ensure fresh data loads
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to cancel booking.");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Booked Adventures</h2>

            {message && <p className="text-red-500">{message}</p>}

            {Object.keys(bookings).length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
            ) : (
                <ul className="space-y-4">
                    {Object.entries(bookings).map(([date, details]) => (
                        <li key={date} className="p-4 border rounded shadow flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{details.adventureName}</h3>
                                <p className="text-sm text-gray-600">Date: {date}</p>
                                <p className="text-sm">Payment Method: {details.paymentMethod}</p>
                            </div>
                            <button
                                onClick={() => handleCancelBooking(date)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Cancel
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingsPage;
