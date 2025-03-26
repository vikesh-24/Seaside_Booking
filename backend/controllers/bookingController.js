import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createBooking = async(req,res) => {
 try {
    console.log(req.body);
    const {user:userId,date,packageName,paymentMethod, totalPrice,numPeople} = req.body;
   console.log(userId); 

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

        const bookingDate = new Date(booking.date); // Date when the booking was made
        const currentDate = new Date(); // Current date

        // Calculate the difference in days between the current date and booking date
        const diffInTime = bookingDate.getTime() - currentDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert milliseconds to days

        if (diffInDays <= 2) {
            // If the difference is 2 days or less, allow cancellation
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
        } else {
            return res.status(400).json({ message: "Booking cannot be canceled as it is beyond the 2-day window." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error canceling the booking", error });
    }
};