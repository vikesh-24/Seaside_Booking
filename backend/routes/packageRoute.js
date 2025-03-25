import express from "express";
import {
    createPackage,
    getAllPackages,
    getPackage,
    updatePackage,
    deletePackage
} from "../controllers/packageController.js"; // s✅ Corrected path


const packageRouter = express.Router();

// Routes
packageRouter.get("/all", getAllPackages); // ✅ Get all packages
packageRouter.post("/add", createPackage); // ✅ Add a new package
packageRouter.get("/:id", getPackage); // ✅ Get a specific package by ID
packageRouter.put("/edit/:id", updatePackage); // ✅ Update a package
packageRouter.delete("/delete/:id", deletePackage); // ✅ Delete a package

export default packageRouter;
