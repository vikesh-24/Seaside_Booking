import Package from '../models/package.js';

// ✅ Create a new adventure package
export const createPackage = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        
        const { title, description, price, capacity, availableDates, status } = req.body;
        
        if (!title || !description || !price || !capacity || !availableDates || !status) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const existingPackage = await Package.findOne({ title });
        if (existingPackage) {
            return res.status(400).json({ message: "Package with this title already exists" });
        }

        const newPackage = await Package.create({
            title, description, price, capacity, availableDates, status
        });

        res.status(201).json({ message: "Adventure package created successfully", data: newPackage });
    } catch (error) {
        console.error("Error creating package:", error);
        res.status(500).json({ message: "Error creating package", error: error.message });
    }
};

// ✅ Get all adventure packages
export const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json({ message: "Packages retrieved successfully", data: packages });
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: "Error fetching packages", error: error.message });
    }
};

// ✅ Get a single adventure package by ID
export const getPackage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid package ID" });
        }

        const packageData = await Package.findById(id);
        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json({ message: "Package retrieved successfully", data: packageData });
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).json({ message: "Error fetching package", error: error.message });
    }
};

// ✅ Update an adventure package
export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid package ID" });
        }

        const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json({ message: "Package updated successfully", data: updatedPackage });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: "Error updating package", error: error.message });
    }
};

// ✅ Delete an adventure package
export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid package ID" });
        }

        const deletedPackage = await Package.findByIdAndDelete(id);
        
        if (!deletedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json({ message: "Package deleted successfully", data: deletedPackage });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Error deleting package", error: error.message });
    }
};
