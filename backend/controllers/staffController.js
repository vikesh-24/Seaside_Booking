import Staff from "../models/staff.js";

// ✅ Create a new staff member
export const createStaff = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging

        // Check if all required fields are provided
        const { name, role, leave, salary } = req.body;
        if (!name || !role || !leave || salary === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the staff already exists
        const existingStaff = await Staff.findOne({ name });
        if (existingStaff) {
            return res.status(400).json({ message: "Staff already exists" });
        }

        // Create new staff record
        const newStaff = await Staff.create({ name, role, leave, salary });

        res.status(201).json({ message: "Staff created successfully", data: newStaff });
    } catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).json({ message: "Error creating staff", error: error.message });
    }
};

// ✅ Get all staff members
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

// ✅ Get a single staff member by ID
export const getStaff = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
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

// ✅ Update a staff member
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, leave, salary } = req.body;

        // Validate MongoDB ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid staff ID" });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            id,
            { name, role, leave, salary },
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

export const deleteStaff = async (req, res) => {
  try {
      const { id } = req.params;

      // Validate MongoDB ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "Invalid staff ID" });
      }

      // Attempt to delete the staff member
      const deletedStaff = await Staff.findByIdAndDelete(id);
      
      // If the staff member wasn't found, return a 404
      if (!deletedStaff) {
          return res.status(404).json({ message: "Staff not found" });
      }

      // Successfully deleted, return the deleted staff data
      res.status(200).json({ 
          message: "Staff deleted successfully", 
          data: deletedStaff 
      });

  } catch (error) {
      console.error("Error deleting staff:", error);

      // Provide a 500 error response with the error message
      res.status(500).json({ 
          message: "Error deleting staff", 
          error: error.message 
      });
  }
};

