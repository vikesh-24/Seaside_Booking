import mongoose from "mongoose"; 

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    bookings: {
        type: Map, // Allows storing key-value pairs dynamically
        of: new mongoose.Schema({
            adventureName: String,
            paymentMethod: String,
        }, { _id: false }), 
        default: {}
    },
    role: { type: String, default: "user" }
}, { minimize: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
