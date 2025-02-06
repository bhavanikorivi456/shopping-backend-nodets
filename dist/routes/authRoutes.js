"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/signup", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role").optional().isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"), // Role optional but should be valid if provided
], authController_1.signup);
router.post("/login", authController_1.login);
router.post("/reset-password", authController_1.resetPassword);
exports.default = router;
