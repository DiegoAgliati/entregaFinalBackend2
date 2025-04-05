// dao/models/category.model.js
import mongoose from 'mongoose';

// Define el esquema de la categoría
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Asegúrate de que las categorías sean únicas
  },
  description: {
    type: String,
    required: false,  // Si quieres una descripción opcional para la categoría
  }
});

// Crea y exporta el modelo de categoría
export const Category = mongoose.model('Category', categorySchema);
