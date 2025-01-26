import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProductDescription, updateProductQuantity } from "../controllers/productController";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), addProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/quantity", updateProductQuantity);
router.patch("/:id/description", updateProductDescription);


export default router;