import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import staffRoutes from "./routes/staffRoutes.js"; // ✅ Import correctly

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use("/api/staffs", staffRoutes); // ✅ Matches the fixed routes

const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
