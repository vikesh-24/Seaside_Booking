import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createBooking = async(req,res) => {
 try {
    console.log(req.body);
    const {user:userId,date,packageName,paymentMethod, totalPrice,numPeople} = req.body; 

    //User Validation 
    const existingUser = await User.findById(userId); 
    if(!existingUser){
        return res.status(400).json({message:"User Not Found"});
    } 

    //New Booking Creation 
    const newBooking = new Booking({
        user:userId,
        date,
        packageName,
        paymentMethod,
        totalPrice,
        numPeople
    }) 

    //Save the Booking 
    const savedBooking = await newBooking.save(); 
    console.log(savedBooking);
    
    //Updating the User's booking Array 
    existingUser.bookings.push(savedBooking._id); 
    await existingUser.save(); 

    return res.status(201).json({message:"Booking Created Successfully",booking:savedBooking});

} 
 catch (error) {
    console.log(error);
    return res.status(500).send("Error when Booking");
    
 }
} 

export const getAllBooking = async(req,res) => {
    try {
        const bookings = await Booking.find(); 
        res.status(200).json({message:"Packages booked Are", data:bookings});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in Getting Bookings "});
        
    }

} 

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params; // Booking ID from params

        // Find the booking by its ID
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Remove the booking from the database
        await Booking.findByIdAndDelete(bookingId);

        // Optionally: Remove booking from User's booking list
        const user = await User.findById(booking.user);
        if (user) {
            user.bookings = user.bookings.filter(
                (booking) => booking.toString() !== bookingId
            );
            await user.save();
        }

        return res.status(200).json({ message: "Booking canceled successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error canceling the booking", error });
    }
};
