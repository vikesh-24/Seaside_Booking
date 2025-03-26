import { useState } from "react";
import axios from "axios";

const BookingForm = () => {
    const [adventureName, setAdventureName] = useState("");
    const [date, setDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [message, setMessage] = useState("");

    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage("");
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You need to be logged in to book an adventure.");
                return;
            }
    
            const response = await axios.post(
                "http://localhost:5000/api/bookings/", // Fixed URL
                { adventureName, date, paymentMethod },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-center items-center">
            <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-3xl border-4 border-blue-300 transition-all transform hover:scale-105 duration-300 ease-in-out">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Book an Adventure</h2>
                <form onSubmit={handleBooking} className="space-y-4">
                    {/* Adventure Name */}
                    <input
                        type="text"
                        placeholder="Adventure Name"
                        value={adventureName}
                        onChange={(e) => setAdventureName(e.target.value)}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        required
                    />
                    
                    {/* Date */}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        required
                    />
                    
                    {/* Payment Method */}
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                    >
                        <option value="online">Online Payment</option>
                        <option value="on-property">On-Property Payment</option>
                    </select>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Book Adventure
                    </button>
                </form>
                
                {/* Message */}
                {message && (
                    <p className={`mt-4 text-center ${message.includes("success") ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
