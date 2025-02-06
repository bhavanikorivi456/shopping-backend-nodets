import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import  authRoutes from "./routes/authRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5174",        // Local development frontend
  "https://shoppingcart-vite-react.netlify.app", // Production frontend
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with matching origins or from same-origin requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or ot
}
app.use(cors(
  corsOptions
));
app.use(express.json()); 

// Routes
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

// Connect to MongoDB
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
