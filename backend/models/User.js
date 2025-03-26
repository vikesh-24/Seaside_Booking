import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    bookings: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Booking'
      }
    ],
    role: { type: String, default: "user" },
  },
  { minimize: false }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
