"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const upload_1 = __importDefault(require("../middleware/upload"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", productController_1.getProducts);
router.get("/:id", productController_1.getProductById);
router.post("/", upload_1.default.single("image"), productController_1.addProduct);
router.delete("/:id", productController_1.deleteProduct);
router.patch("/:id/quantity", productController_1.updateProductQuantity);
router.post("/update-quantity", productController_1.updateProductQuantity);
router.patch("/:id/quantity", authMiddleware_1.authenticate, productController_1.updateProductQuantity);
exports.default = router;
