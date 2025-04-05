import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../dao/models/user.model.js";
import { config } from "dotenv";
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local'; 


const cookieExtractor = (req) => {
  return req?.cookies?.token || null; // ← Nombre de la cookie debe ser "token"
};

passport.use("current", new JWTStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id).populate('cart').lean();

      return done(null, user || false);
    } catch (error) {
      return done(error);
    }
  }
));


passport.use("login", new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Usuario no existe" });

      // Comparar contraseñas usando bcrypt
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));