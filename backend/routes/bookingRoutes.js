import express from "express";
import { bookAdventure, cancelBooking, getUserBookings } from "../controllers/bookingController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, bookAdventure);  // Book adventure
router.delete("/:date", authenticateUser, cancelBooking); // Cancel booking by date
router.get("/", authenticateUser,getUserBookings);

export default router;
