import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { config } from 'dotenv';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mocksRouter from './routes/mocks.routes.js';

// Routers
import sessionsRouter from './routes/sessions.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js'; 

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

// 2. Middlewares básicos
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, "../public")));


// 3. Autenticación
app.use(passport.initialize()); 
app.use(userToViews); 

// 4. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB!'))
  .catch(error => {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  });

// 5. Rutas principales
app.use('/api/sessions', sessionsRouter); 
app.use('/api/carts', cartsRouter); 
app.use('/api/products', productsRouter); 
app.use('/api/mocks', mocksRouter);
app.use('/', viewsRouter); 

// 6. Manejo de errores
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
