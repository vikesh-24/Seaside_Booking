import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true // Removes leading/trailing spaces
    },
    role: {
        type: String,
        required: true,
        default: "Staff",
        enum: ["safeguard", "boatopearator", "divingguide", "admin", "manager"] // Limits to specific roles
    },
    leave: {
        type: String,
        required: [true, "Leave is required"],
        enum: ["sick", "casual", "annual", "unpaid"] // Limits to valid leave types
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"] // Prevents negative salary values
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
