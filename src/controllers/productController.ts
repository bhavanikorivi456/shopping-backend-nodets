import { Request, RequestHandler, Response } from "express";
import Product, { IProduct } from "../models/Product";
import mongoose from "mongoose";


export const getProducts = async(req: Request, res: Response)=>{
    try {
        const { category } = req.query;
    
        // Filter products by category if provided
        const products = category && category !== "All"
          ? await Product.find({ category })
          : await Product.find();
    
        // Send the filtered or all products as the response 
        res.status(200).json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products", error });
      }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);  // Log the error
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
  };

export const addProduct = async (req: Request, res: Response) => {
    try {
      const { name, price, category, quantity, image, description } = req.body;
    
        // Create a new product instance
        const newProduct = new Product({ name, price, quantity, category, image, description });
    
        // Save the product to the database
        const savedProduct = await newProduct.save();
    
        // Send the saved product as a response
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(400).json({ message: "Failed to add product", error });
      }
};


export const deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (deletedProduct) {
        res.json({ message: "Product deleted successfully", deletedProduct });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product", error });
    }
  };

  export const updateProductQuantity: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID format" });
      return;
    }
  
    try {
      // Fetch the product by ID from the database
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      // Log the current quantity of the product
      console.log(`Current quantity of product ${product.name}: ${product.quantity}`);
  
      // Add the requested quantity to the current stock
      product.quantity += quantity;
  
      // Save the updated product
      await product.save();
  
      res.status(200).json({ message: "Quantity updated successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Failed to update quantity", error });
    }
  };

  export const updateProductDescription: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { description } = req.body;
  
    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID format" });
      return;
    }
  
    try {
      // Fetch the product by ID
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      // Update the description of the product
      product.description = description;
  
      // Save the updated product
      await product.save();
  
      // Return the response without returning a value explicitly
      res.status(200).json({ message: "Product description updated successfully", product });
    } catch (error) {
      // Catch any error that occurs and send the response
      res.status(500).json({ message: "Failed to update product description", error });
    }
  };
  
  