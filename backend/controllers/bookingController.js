import User from "../models/User.js";
import moment from "moment";

export const bookAdventure = async (req, res) => {
    try {
        const { adventureName, date, paymentMethod } = req.body;

        if (!adventureName || !date || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const userId = req.user.id; // Extract user ID from token middleware
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Ensure user does not already have a booking for the same date
        if (user.bookings.has(date)) {
            return res.status(400).json({ message: "You already have a booking for this date." });
        }

        // Save the booking in the user's document
        user.bookings.set(date, { adventureName, paymentMethod }); 
        await user.save();

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

        const userId = req.user.id;  // Extract user ID from authentication
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Ensure booking exists before deleting
        if (!user.bookings[date]) {
            return res.status(404).json({ message: "No booking found for this date." });
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

