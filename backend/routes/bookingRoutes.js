import express from "express"; 
import {
    createBooking,
    getUserBooking,
    cancelBooking
} from "../controllers/bookingController.js"; 



const router = express.Router(); 

router.post('/',createBooking); 
router.get('/user/:userId',getUserBooking);
router.delete('/cancel/:bookingId',cancelBooking);


export default router;