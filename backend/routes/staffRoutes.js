import express from "express";
import {
    createStaff,
    getAllStaff,
    getStaff,
    updateStaff,
    deleteStaff
} from "../controllers/staffController.js";

const router = express.Router(); // ✅ Use a standard `router` name

// Routes
router.get("/all", getAllStaff); // ✅ Get all staff
router.post("/add", createStaff); // ✅ Use `/add` instead of `/addstaff` for cleaner API
router.get("/:id", getStaff); // ✅ No need for `/staff/` prefix
router.put("/edit/:id", updateStaff); // ✅ Simplified to `/edit/:id`
router.delete("/delete/:id", deleteStaff); // ✅ Simplified to `/delete/:id`

export default router;
