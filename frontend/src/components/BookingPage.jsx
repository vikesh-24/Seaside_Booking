import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const BookingsPage = () => {
    const [bookings, setBookings] = useState({});
    const [filteredBookings, setFilteredBookings] = useState({});
    const [message, setMessage] = useState("");
    const [searchDate, setSearchDate] = useState(""); // State for the search input
    const navigate = useNavigate(); // Initialize useNavigate hook

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
            setFilteredBookings(response.data.bookings); // Initially set all bookings as filtered
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch bookings.");
        }
    };

    const handleCancelBooking = async (date) => {
        try {
            const token = localStorage.getItem("token");
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

    // Handle date search input change
    const handleSearchChange = (e) => {
        const date = e.target.value;
        setSearchDate(date);

        // Filter bookings by the entered date
        if (date) {
            const filtered = Object.entries(bookings).filter(([bookingDate, details]) => {
                return bookingDate.includes(date); // Matches the entered date (partial match)
            });
            setFilteredBookings(Object.fromEntries(filtered));
        } else {
            setFilteredBookings(bookings); // Show all bookings if no date is entered
        }
    };

    // Button click to navigate to the booking form page
    const handleBookAdventure = () => {
        navigate('/book-adventure'); // Navigate to '/book-adventure' route
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-center items-center">
            <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-3xl border-4 border-blue-300 transition-all transform hover:scale-105 duration-300 ease-in-out">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">My Booked Adventures</h2>

                {message && <p className="text-center text-red-500">{message}</p>}

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="date"
                        value={searchDate}
                        onChange={handleSearchChange}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        placeholder="Search by Date"
                    />
                </div>

                {Object.keys(filteredBookings).length === 0 ? (
                    <p className="text-center text-gray-500">No bookings found.</p>
                ) : (
                    <ul className="space-y-4">
                        {Object.entries(filteredBookings).map(([date, details]) => (
                            <li key={date} className="p-4 border rounded-lg shadow flex justify-between items-center transition-all hover:scale-105 duration-300 ease-in-out">
                                <div>
                                    <h3 className="text-lg font-semibold">{details.adventureName}</h3>
                                    <p className="text-sm text-gray-600">Date: {date}</p>
                                    <p className="text-sm">Payment Method: {details.paymentMethod}</p>
                                </div>
                                <button
                                    onClick={() => handleCancelBooking(date)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Button to navigate to Book Adventure page */}
                <button
                    onClick={handleBookAdventure}
                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                >
                    Book an Adventure
                </button>
            </div>
        </div>
    );
};

export default BookingsPage;
