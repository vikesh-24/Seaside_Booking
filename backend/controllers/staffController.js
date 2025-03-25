import mongoose from "mongoose";
import Staff from "../models/staff.js";


// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging

        const { firstname, lastname, role, leave, salary } = req.body;
        if (!firstname || !lastname || !role || !leave || salary === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Fix: Check if staff already exists by firstname & lastname
        const existingStaff = await Staff.findOne({ firstname, lastname });
        if (existingStaff) {
            return res.status(400).json({ message: "Staff with this name already exists" });
        }

        const newStaff = await Staff.create({ firstname, lastname, role, leave, salary });
        res.status(201).json({ message: "Staff created successfully", data: newStaff });
    } catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).json({ message: "Error creating staff", error: error.message });
    }
};


// Get all staff members
export const getAllStaff = async (req, res) => {
    try {
        const allStaffs = await Staff.find();
        if (allStaffs.length === 0) {
            return res.status(404).json({ message: "No staff members found" });
        }
        res.status(200).json({ message: "Staff members retrieved successfully", data: allStaffs });
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ message: "Error fetching staff", error: error.message });
    }
};

// Get a single staff member by ID
export const getStaff = async (req, res) => {
    try {
        const { id } = req.params;

        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid staff ID" });
        }

        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.status(200).json({ message: "Staff member retrieved successfully", data: staff });
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ message: "Error fetching staff", error: error.message });
    }
};


export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, role, leave, salary } = req.body;

        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid staff ID" });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            id,
            { firstname, lastname, role, leave, salary },
            { new: true, runValidators: true }
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.status(200).json({ message: "Staff updated successfully", data: updatedStaff });
    } catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ message: "Error updating staff", error: error.message });
    }
};

// Delete a staff member
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid staff ID" });
        }

        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.status(200).json({ message: "Staff deleted successfully", data: deletedStaff });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ message: "Error deleting staff", error: error.message });
    }
};
