import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const BookingForm = () => {
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get("packageId");

    const [adventureName, setAdventureName] = useState("");
    const [price, setPrice] = useState(0); // Store package price
    const [date, setDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [numPeople, setNumPeople] = useState(1); // Store number of people
    const [totalPrice, setTotalPrice] = useState(0); // Store calculated total price
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (packageId) {
            fetchPackageDetails(packageId);
        }
    }, [packageId]);

    // Fetch package details using packageId
    const fetchPackageDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
            if (response.data.data) {
                setAdventureName(response.data.data.title);
                setPrice(response.data.data.price); // Set the price from the package
            }
        } catch (error) {
            console.error("Error fetching package details:", error);
            setMessage("Failed to load package details.");
        }
    };

    // Calculate the total price based on the number of people and payment method
    const calculateTotalPrice = () => {
        let calculatedPrice = price * numPeople;
        
        // Apply discount if online payment method is selected
        if (paymentMethod === "online") {
            calculatedPrice = calculatedPrice * 0.9; // 10% discount
        }
        
        setTotalPrice(calculatedPrice); // Update the total price
    };

    useEffect(() => {
        calculateTotalPrice(); // Recalculate price whenever the number of people or payment method changes
    }, [numPeople, paymentMethod, price]);

    // Handle booking submission
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
                "http://localhost:5000/api/bookings/",
                { packageId, adventureName, date, paymentMethod, totalPrice, numPeople },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);

            setMessage(response.data.message || "Booking successful!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Booking failed");
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-center items-center">
            <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-3xl border-4 border-blue-300 transition-all transform hover:scale-105 duration-300 ease-in-out">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Book an Adventure</h2>
                <form onSubmit={handleBooking} className="space-y-4">
                    {/* Adventure Name (Read-only) */}
                    <input
                        type="text"
                        placeholder="Adventure Name"
                        value={adventureName}
                        readOnly
                        className="w-full p-3 border border-blue-300 rounded-lg bg-gray-100"
                    />

                    {/* Date */}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        required
                        min={today} // Set minimum date to today
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

                    {/* Number of People */}
                    <input
                        type="number"
                        value={numPeople}
                        onChange={(e) => setNumPeople(e.target.value)}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        min="1"
                        required
                    />

                    {/* Total Price */}
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Total Price:</p>
                        <p className="text-lg font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
                    </div>

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
                    <p className={`mt-4 text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
