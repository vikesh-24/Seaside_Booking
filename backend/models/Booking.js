import mongoose from 'mongoose'; 

const BookingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    packageName:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    numPeople:{
        type:Number,
        required:true
    }
},
{timestamps:true})

const Booking = mongoose.model('Booking',BookingSchema);

export default Booking;