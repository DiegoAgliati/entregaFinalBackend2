import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../dao/models/user.model.js';
import { Cart } from '../dao/models/cart.model.js';
import { config } from 'dotenv';
config();

export class AuthService {
    static async registerUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) throw new Error('El email ya está registrado');

        // Crear carrito vacío
        const newCart = await Cart.create({ products: [] });

        // Crear usuario con ese carrito asignado
        const newUser = await User.create({
            ...userData,
            cart: newCart._id
        });

        return newUser;
    }

    static async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Credenciales inválidas');
        }

        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }
}
