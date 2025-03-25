import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Await the database query

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    return res.status(200).json({ message: "Users Found", data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Getting Users" });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Await the database query

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({ message: "User Found", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Getting User" });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      password: hashedPassword,
    });

    await user.save(); // Save user to the database

    return res.status(201).json({ message: "User Registered Successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Registering User" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email }); // Await needed here

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Logging In User" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Logging Out User" });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Hash password if it's being updated
    let updatedPassword = user.password;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(req.body.password, salt);
    }

    // Update user
    user.name = req.body.name || user.name;
    user.password = updatedPassword;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;

    const updatedUser = await user.save();

    return res.status(200).json({ message: "User Updated Successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Updating User" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Deleting User" });
  }
};
