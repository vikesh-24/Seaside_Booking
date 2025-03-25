import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Denied"], default: "Pending" },
});

const Leave = mongoose.model("Leave", LeaveSchema);
export default Leave; 
