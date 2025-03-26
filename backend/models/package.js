import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true // Removes leading/trailing spaces
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"] // Ensures price is non-negative
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be at least 1"] // Ensures at least one participant
    },
    availableDates: {
        type: [Date], // Stores an array of available dates
        required: [true, "Available dates are required"]
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive", "Cancelled"], // Restricts values to valid statuses
        default: "Active"
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema);


export default Package;
