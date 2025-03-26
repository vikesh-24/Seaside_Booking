import User from "../models/User.js";
import Package from "../models/Package.js"; // Assuming you have a Package model to get price
import moment from "moment";

export const bookAdventure = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { adventureName, date, paymentMethod, packageId, numPeople } = req.body;

        // Validate input fields
        if (!adventureName || !date || !paymentMethod || !packageId || !numPeople) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Fetch package details based on packageId
        const adventurepackage = await Package.findById(packageId);
        if (!adventurepackage) {
            return res.status(404).json({ message: "Package not found." });
        }

        // Calculate the total price
        const totalPrice = adventurepackage.price * numPeople;

        const userId = req.user.id; // Assuming the user is authenticated and their ID is in the token
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Add the new booking to the array
        const newBooking = {
            date,
            packageId,
            adventureName,
            paymentMethod,
            totalPrice,
        };

        // Update or add the new booking
        user.bookings.set(date, newBooking); // This will update or set the booking for the specific date

        await user.save(); // Save the updated user document

        return res.status(201).json({ message: "Adventure booked successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Try again later." });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { date } = req.query;  // Get the date from query parameters

        if (!date) {
            return res.status(400).json({ message: "Date is required to cancel a booking." });
        }

        // Validate date format
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        const userId = req.user.id;  // Extract user ID from authentication
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Ensure booking exists before deleting
        if (!user.bookings[date]) {
            return res.status(404).json({ message: "No booking found for this date." });
        }

        // Optional: Check if the booking is eligible for cancellation (e.g., within 48 hours)
        const bookingDate = moment(date);
        const currentDate = moment();
        if (bookingDate.isBefore(currentDate.add(2, 'days'))) {
            return res.status(400).json({ message: "Booking cannot be cancelled within 2 days." });
        }

        // Remove the booking from the user document
        delete user.bookings[date];  
        await user.save();

        return res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (error) {
        console.error("❌ Error in cancelBooking:", error);
        return res.status(500).json({ message: "Server error. Try again later." });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token middleware
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ bookings: user.bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Try again later." });
    }
};
