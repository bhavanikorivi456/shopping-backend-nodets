import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Connect to MongoDB
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
