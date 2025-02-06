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
exports.updateProductQuantity = exports.deleteProduct = exports.addProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        // Filter products by category if provided
        const products = category && category !== "All"
            ? yield Product_1.default.find({ category })
            : yield Product_1.default.find();
        // Send the filtered or all products as the response 
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products", error });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error('Error fetching product:', error); // Log the error
        res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
});
exports.getProductById = getProductById;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category, quantity, image, description } = req.body;
        // Create a new product instance
        const newProduct = new Product_1.default({ name, price, quantity, category, image, description });
        // Save the product to the database
        const savedProduct = yield newProduct.save();
        // Send the saved product as a response
        res.status(201).json(savedProduct);
    }
    catch (error) {
        console.error("Error adding product:", error);
        res.status(400).json({ message: "Failed to add product", error });
    }
});
exports.addProduct = addProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield Product_1.default.findByIdAndDelete(id);
        if (deletedProduct) {
            res.json({ message: "Product deleted successfully", deletedProduct });
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
});
exports.deleteProduct = deleteProduct;
const updateProductQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, quantity } = req.body;
    try {
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (product.quantity < quantity) {
            res.status(400).json({ message: "Insufficient stock" });
            return;
        }
        product.quantity -= quantity;
        yield product.save();
        res.status(200).json({ message: "Quantity updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update quantity", error });
    }
});
exports.updateProductQuantity = updateProductQuantity;
