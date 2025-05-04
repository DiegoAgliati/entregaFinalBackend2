import { Router } from 'express';
import { Product } from '../dao/models/product.model.js'; 

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: 'success',
      payload: products
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: 'Error al obtener productos' 
    });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { title, description, price, stock, category, code, status, thumbnails } = req.body;

    if (!title || !description || !price || !stock || !category || !code) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

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

    await newProduct.save();

    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

export default router;
