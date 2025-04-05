import { Router } from 'express';
import { Product } from '../dao/models/product.model.js'; 

const router = Router();

// Ruta para crear un nuevo producto
router.post('/products', async (req, res) => {
  try {
    const { title, description, price, stock, category, code, status, thumbnails } = req.body;

    // Validamos que todos los campos necesarios estén presentes
    if (!title || !description || !price || !stock || !category || !code) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Creamos el producto con los datos enviados en la solicitud
    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      category,
      code,
      status: status || true,
      thumbnails: thumbnails || [],
    });

    // Guardamos el producto en la base de datos
    await newProduct.save();

    // Respondemos con el producto creado
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

export default router;
