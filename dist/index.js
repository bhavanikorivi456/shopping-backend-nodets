"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
const allowedOrigins = [
    "http://localhost:5174", // Local development frontend
    "https://shoppingcart-vite-react.netlify.app", // Production frontend
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with matching origins or from same-origin requests
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies or ot
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use("/api/products", productRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
// Connect to MongoDB
(0, db_1.default)();
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
