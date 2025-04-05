import { Router } from 'express'; // Corregir importación
import { Product } from '../dao/models/product.model.js';
import { Cart } from '../dao/models/cart.model.js'; // Importar modelo Cart
import passport from 'passport'; // Corregir importación

const router = Router();

// Ruta home
router.get('/', async (req, res) => {
    res.render('pages/home', {
        title: 'Inicio'
    });
});

// Ruta productos
router.get('/products', 
    passport.authenticate('current', { session: false }),
    async (req, res) => {
      try {
        const products = await Product.find().lean();
        const user = req.user || null;
        
  
        res.render('pages/products', {
          title: 'Productos',
          products,
          user,
          page: 'products'
        });
      } catch (error) {
        res.status(500).render('pages/error', { error: error.message });
      }
    }
  );
// Ruta carrito (corregida la autenticación y sintaxis)
router.get('/cart',
  passport.authenticate('current', { session: false }),
  async (req, res) => {
    try {
      const cart = await Cart.findById(req.user.cart)
        .populate('products.product')
        .lean();

      if (!cart || !cart.products || cart.products.length === 0) {
        return res.render('pages/cart', {
          title: 'Tu Carrito',
          cart: null,
          user: req.user,
          total: 0,
          message: 'Tu carrito está vacío.'
        });
      }

      let total = 0;
      cart.products.forEach(item => {
        if (item.product && item.product.price) {
          total += item.product.price * item.quantity;
        }
      });

      res.render('pages/cart', {
        title: 'Tu Carrito',
        cart,
        user: req.user,
        page: 'cart',
        total
      });
    } catch (error) {
      res.status(500).render('pages/error', { error: error.message });
    }
  }
);


router.get('/register', (req, res) => {
    res.render('pages/register', {
        title: 'Registro'
    });
});

// Ruta login
router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Ingreso'
    });
});

export default router;