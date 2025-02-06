"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() }); // return the response here
        return;
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" }); // return the response here
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ name, email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.signup = signup;
// Login Controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
        res.status(200).json({ token, role: user.role }); // Send role to frontend
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update user's password
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
