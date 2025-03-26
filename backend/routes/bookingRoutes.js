import express from "express"; 
import {
    createBooking,
    getAllBooking,
    cancelBooking
} from "../controllers/bookingController.js"; 



const router = express.Router(); 

router.post('/',createBooking); 
router.get('/',getAllBooking);
router.delete('/cancel/:bookingId',cancelBooking);


export default router;