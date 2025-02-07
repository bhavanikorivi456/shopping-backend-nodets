import { Request, Response } from "express";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/authMiddleware";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const signup = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }); // return the response here
      return;
    }
  
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already in use" }); // return the response here
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  // Login Controller
  export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return
      } 
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ token, role: user.role }); // Send role to frontend
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getUserData = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      res.status(400).json({ message: "User ID not found in request" });
      return;
    }
  
    res.status(200).json({ message: "User data fetched successfully", userId: req.userId });
  };
  

  export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Request Body:", req.body); // Log incoming data
  
      const { email, newPassword, confirmPassword } = req.body;
  
      // Validate input
      if (!email || !newPassword || !confirmPassword) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
  
      if (newPassword !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match" });
        return;
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  