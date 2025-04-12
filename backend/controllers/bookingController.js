import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
    try {
      console.log("Received Data:", req.body);
  
      const { userId, date, packageName, paymentMethod, totalPrice, numPeople } = req.body;
  
      // Check for missing fields
      if (!userId || !date || !packageName || !paymentMethod || !totalPrice || !numPeople) {
        return res.status(400).json({ message: "Missing required fields", received: req.body });
      }
  
      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(400).json({ message: "User Not Found" });
      }
  
      // Create booking
      const newBooking = new Booking({ user: userId, date, packageName, paymentMethod, totalPrice, numPeople });
  
      const savedBooking = await newBooking.save();
  
      // Update user's booking list
      existingUser.bookings.push(savedBooking._id);
      await existingUser.save();
  
      return res.status(201).json({ message: "Booking Created Successfully", booking: savedBooking });
  
    } catch (error) {
      console.error("Booking Error:", error);
      return res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  

export const getUserBooking = async(req,res) => {
    try {
       const {userId} = req.params; 
       const user = await User.findById(userId).populate('bookings'); 

       if(!user){
        return res.status(404).json({message:"User Not Found"})
       }

       return res.status(200).json({message:"Booked Adventures are",data:user.bookings})
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in Getting Bookings "});
        
    }

} 

export const cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params; // Get bookingId from the URL params
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Remove the booking from the database
      await Booking.findByIdAndDelete(bookingId);
  
      // Optionally: Remove booking from the User's bookings array
      const user = await User.findById(booking.user);
      if (user) {
        user.bookings = user.bookings.filter(
          (booking) => booking.toString() !== bookingId
        );
        await user.save();
      }
  
      return res.status(200).json({ message: "Booking canceled successfully." });
    } catch (error) {
      console.error("Error canceling booking:", error);
      return res.status(500).json({ message: "Error canceling the booking", error });
    }
  };
  