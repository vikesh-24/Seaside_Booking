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
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Book an Adventure</h2>
            <form onSubmit={handleBooking} className="space-y-3">
                <input
                    type="text"
                    placeholder="Adventure Name"
                    value={adventureName}
                    onChange={(e) => setAdventureName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="online">Online Payment</option>
                    <option value="on-property">On-Property Payment</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Book Adventure
                </button>
            </form>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default BookingForm;
