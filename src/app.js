import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { config } from 'dotenv';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import sessionsRouter from './routes/sessions.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js'; // Importar la nueva ruta

// Configuraciones
import './config/passport.config.js';
import { userToViews } from './middleware/authView.middleware.js';

// Configurar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configurar rutas de archivos ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuración de Handlebars (DEBE IR PRIMERO)
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    multiply: (a, b) => a * b
  }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares básicos (ORDEN CRÍTICO)
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear form-data
app.use(cookieParser()); // Para manejar cookies
app.use(express.static(path.join(__dirname, "../public")));

// 3. Autenticación
app.use(passport.initialize()); // Inicializar Passport
app.use(userToViews); // Middleware para inyectar usuario en vistas

// 4. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB!'))
  .catch(error => {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  });

// 5. Rutas principales (ORDEN CRÍTICO)
app.use('/api/sessions', sessionsRouter); // Rutas de autenticación
app.use('/api/carts', cartsRouter); // Rutas del carrito
app.use('/api/products', productsRouter); // Usar la ruta de productos
app.use('/', viewsRouter); // Rutas de vistas (DEBE IR ÚLTIMO)

// 6. Manejo de errores (DEBE SER EL ÚLTIMO MIDDLEWARE)
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).render('pages/error', {
    title: 'Error',
    error: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
