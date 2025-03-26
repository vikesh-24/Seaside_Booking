import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["Income", "Expense"], 
    },
    date: {
        type: Date,
        required: true,
        default: Date.now, 
    },
    details: {
        type: String,
        required: true, 
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be a positive number"], 
    },
}, { timestamps: true }); 

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
