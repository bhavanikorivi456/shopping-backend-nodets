import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProductQuantity } from "../controllers/productController";
import upload from "../middleware/upload";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), addProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/quantity", updateProductQuantity);
router.post("/update-quantity", updateProductQuantity);
router.patch("/:id/quantity", authenticate, updateProductQuantity);


export default router;