import { Cart } from '../dao/models/cart.model.js';
import { Product } from '../dao/models/product.model.js';
import { TicketService } from './ticket.service.js';

export class CartService {
  static async processPurchase(cartId) {
    const cart = await Cart.findById(cartId).populate('products.product');
    const unprocessedProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
      } else {
        unprocessedProducts.push(item.product._id);
      }
    }

    const ticket = await TicketService.createTicket({
      amount: totalAmount,
      purchaser: cart.user?.email || 'Unknown',  // Defaulting to 'Unknown' if email is not found
    });

    // Limpiar productos procesados del carrito
    cart.products = cart.products.filter(
      item => !unprocessedProducts.includes(item.product._id.toString())
    );

    // Vaciar el carrito después de procesar la compra
    cart.products = [];  // Limpiar el carrito completamente
    await cart.save();   // Guardar el carrito vacío en la base de datos

    return {
      ticket,
      unprocessedProducts,
      productsProcessed: cart.products.length - unprocessedProducts.length
    };
  }

  static async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }
}
