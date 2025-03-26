import express from "express";
import { bookAdventure, cancelBooking, getUserBookings } from "../controllers/bookingController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to book an adventure
router.post("/", authenticateUser, bookAdventure);

// Route to cancel a booking, passing the date as a query parameter (e.g., /api/bookings?date=2025-03-26)
router.delete("/", authenticateUser, cancelBooking); // Cancel booking by date

// Route to get all user bookings
router.get("/all", authenticateUser, getUserBookings);

export default router;
