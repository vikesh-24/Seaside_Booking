import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]); // Initialize as an empty array
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Declare the fetchBookings function outside of useEffect so that it can be used in other parts of the code
    

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setMessage("You need to be logged in to view your bookings.");
                    return;
                }
    
                const response = await axios.get("http://localhost:5000/api/bookings/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                console.log("Fetched Bookings Data:", response.data.bookings); // Log the bookings data
    
                setBookings(response.data.bookings); // Update state with bookings data
            } catch (error) {
                setMessage(error.response?.data?.message || "Failed to fetch bookings.");
            }
        };
        
        fetchBookings(); // Fetch bookings when the component mounts
    }, []);

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
            setTimeout(fetchBookings, 500); // Ensure fresh data loads after cancellation
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to cancel booking.");
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

                {Array.isArray(bookings) && bookings.length === 0 ? (
                    <p className="text-center text-gray-500">No bookings found.</p>
                ) : (
                    <ul className="space-y-4">
                        {Array.isArray(bookings) ? (
                            bookings.map((details, index) => (
                                <li key={index} className="p-4 border rounded-lg shadow flex justify-between items-center transition-all hover:scale-105 duration-300 ease-in-out">
                                    <div>
                                        <h3 className="text-lg font-semibold">{details.adventureName}</h3>
                                        <p className="text-sm text-gray-600">Date: {details.date}</p>
                                        <p className="text-sm">Payment Method: {details.paymentMethod}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCancelBooking(details.date)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-red-500">Something went wrong. Please try again later.</p>
                        )}
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
