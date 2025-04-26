import express from "express"; 
import {
    createBooking,
    getUserBooking,
    cancelBooking,
    updateBooking,
    getAllBookings
} from "../controllers/bookingController.js"; 



const router = express.Router(); 

router.post('/',createBooking); 
router.get('/user/:userId',getUserBooking);
router.get('/all',getAllBookings);
router.delete('/cancel/:bookingId',cancelBooking);
router.put('/update/:bookingId',updateBooking);


export default router;