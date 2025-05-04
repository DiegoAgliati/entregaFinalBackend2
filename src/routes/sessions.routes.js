import { Router } from "express";
import passport from "passport";
import { UserDTO } from "../dao/dtos/user.dto.js";
import { AuthService } from '../services/auth.service.js';
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../dao/models/user.model.js";

const router = Router();

router.get("/current", 
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
  }
);

router.post('/register', async (req, res) => {
  try {
      const newUser = await AuthService.registerUser(req.body);
      res.redirect('/login');
  } catch (error) {
      res.status(400).render('pages/register', {
          title: 'Registro',
          error: error.message
      });
  }
});

router.post("/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }).redirect("/products");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json({
      status: 'success',
      payload: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/');
});


export default router;