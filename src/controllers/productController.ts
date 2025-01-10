import { Request, RequestHandler, Response } from "express";
import Product, { IProduct } from "../models/Product";


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
    const { id, quantity } = req.body;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      if (product.quantity < quantity) {
        res.status(400).json({ message: "Insufficient stock" });
        return;
      }
  
      product.quantity -= quantity; 
      await product.save();
  
      res.status(200).json({ message: "Quantity updated successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Failed to update quantity", error });
    }
  };
  