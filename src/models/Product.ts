import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
    description: string;
}

const ProductScema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    description: { type: String, required: false }, 
});

const Product = mongoose.model<IProduct>("Product", ProductScema)
export default Product;