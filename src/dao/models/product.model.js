import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true, unique: true, default: () => uuidv4() },
  status: { type: Boolean, default: true },
  thumbnails: { type: [String], default: [] } 
});


productSchema.pre("save", function(next) {
  if (this.stock < 0) {
    throw new Error("Stock no puede ser negativo");
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
