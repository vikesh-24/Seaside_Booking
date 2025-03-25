import express from "express";
import { body, validationResult } from "express-validator";
import Leave from "../models/Leave.js"; // Ensure the correct path

const router = express.Router();

//  Apply for leave
router.post(
  "/apply",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
    body("startDate").isISO8601().withMessage("Invalid start date"),
    body("endDate").isISO8601().withMessage("Invalid end date"),
    body("reason").trim().notEmpty().withMessage("Reason is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, role, startDate, endDate, reason } = req.body;

      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be before end date" });
      }

      const newLeave = new Leave({
        firstName,
        lastName,
        role,
        startDate,
        endDate,
        reason,
        status: "Pending",
      });

      await newLeave.save();
      res.status(201).json({ message: "Leave request submitted successfully" });
    } catch (error) {
      console.error("Error submitting leave request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Fetch all leave requests (for admin)
router.get("/requests", async (req, res) => {
  try {
    const leaveRequests = await Leave.find(); 
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Approve or deny a leave request
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body; 
    
    
    if (!["Approved", "Denied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const leaveRequest = await Leave.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res.status(200).json({ message: `Leave request ${status}` });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
