import express from "express";
import { signup, login, resetPassword } from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"), // Role optional but should be valid if provided
  ],
  signup
);

router.post("/login", login);

router.post("/reset-password", resetPassword);

export default router;
