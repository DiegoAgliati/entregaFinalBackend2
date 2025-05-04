import { Router } from 'express';
import { generateMockUsers, generateMockProducts } from '../mocks/users.mock.js';
import User from '../dao/models/user.model.js';
import Product from '../dao/models/product.model.js';

const router = Router();

router.get('/mockingusers', async (req, res) => {
  try {
    const { count = 50 } = req.query;
    const numericCount = parseInt(count);
    
    if (isNaN(numericCount) || numericCount < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro count debe ser un número positivo'
      });
    }
    
    const users = await generateMockUsers(numericCount);
    
    res.json({
      status: 'success',
      payload: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error al generar usuarios mock:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar usuarios'
    });
  }
});

router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, products = 0 } = req.body;
    
    if (!Number.isInteger(users) || !Number.isInteger(products) || users < 0 || products < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros users y products deben ser números enteros positivos'
      });
    }
    
    let insertedUsers = [];
    let insertedProducts = [];
    
    if (users > 0) {
      const mockUsers = await generateMockUsers(users);
      for (const userData of mockUsers) {
        const user = new User(userData);
        const savedUser = await user.save();
        insertedUsers.push(savedUser);
      }
    }

    if (products > 0) {
      const mockProducts = generateMockProducts(products);
      insertedProducts = await Product.insertMany(mockProducts);
    }
    
    res.json({
      status: 'success',
      message: 'Datos generados e insertados exitosamente',
      users: {
        requested: users,
        inserted: insertedUsers.length
      },
      products: {
        requested: products,
        inserted: insertedProducts.length
      }
    });
  } catch (error) {
    console.error('Error al generar e insertar datos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar e insertar datos',
      error: error.message
    });
  }
});

export default router;