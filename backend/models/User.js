import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    bookings: [{
        date: { type: String, required: true }, // Store the date here
        packageId: { type: String, required: true },
        adventureName: { type: String, required: true },
        paymentMethod: { type: String, required: true },
        totalPrice: { type: Number, required: true }
    }],
    role: { type: String, default: "user" }
}, { minimize: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
