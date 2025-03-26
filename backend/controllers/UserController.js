import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
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
    const user = await User.findById(req.params.id).populate('bookings');
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
    const { name, email, age, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      age, 
      password: hashedPassword, 
      role: role || "user" // 👈 Default role if not provided
    });
    
    await user.save();

    return res.status(201).json({ message: "User Registered Successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Registering User" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login Successful", token, data: existingUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error When Logging In User" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
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
    const { name, email, age, password, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    let updatedPassword = user.password;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.password = updatedPassword;
    user.email = email || user.email;
    user.age = age || user.age;
    user.role = role || user.role; // 👈 Allow role update

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
