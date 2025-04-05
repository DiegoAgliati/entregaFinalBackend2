import { Router } from "express";
import { CartService } from "../services/cart.service.js";
import { Cart } from '../dao/models/cart.model.js';

const router = Router();

// Finalizar compra
router.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { productsProcessed, unprocessedProducts, ticket } = await CartService.processPurchase(cartId);

    res.json({
      ticket,
      unprocessedProducts,
      message: `Compra completada parcialmente. ${productsProcessed} productos procesados`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    quantity = parseInt(quantity) || 1; // 👈 Aseguramos que sea un número

    await CartService.addProductToCart(cid, pid, quantity);

    res.json({ message: "Producto agregado al carrito con éxito." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una unidad de un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    res.json({ message: 'Producto actualizado en el carrito' });

  } catch (error) {
    console.error('Error al eliminar unidad del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Vaciar carrito completo
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.products = [];

    await cart.save();

    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error interno al vaciar el carrito' });
  }
});

export default router;
