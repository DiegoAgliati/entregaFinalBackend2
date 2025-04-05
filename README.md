# TechStore - Proyecto de E-commerce

## Descripción

**TechStore** es una aplicación de comercio electrónico diseñada para gestionar productos tecnológicos. El sistema permite la creación de una tienda en línea donde los usuarios pueden registrarse, ver productos, agregar al carrito y finalizar compras. El proyecto está implementado con tecnologías modernas que incluyen Node.js, Express, MongoDB, y Handlebars para el manejo de vistas.

### Objetivos

- **Profesionalización de Servidor:** Implementación de una arquitectura robusta y escalable utilizando buenas prácticas de desarrollo, como patrones de diseño (DAO, DTO, y Repository).
- **Autenticación y Seguridad:** Sistema de autenticación para gestionar el acceso a los usuarios y administradores, garantizando seguridad y eficiencia.
- **Gestión de Carrito y Compras:** Los usuarios pueden agregar productos a un carrito de compras, realizar un proceso de compra, generar un ticket con el resumen de la compra y vaciar su carrito.
  
## Características

- **Registro y Login de Usuario:**
  - Registro con nombre, apellido, email, edad y contraseña.
  - Autenticación basada en sesiones con seguridad.
  
- **Gestión de Productos:**
  - Los administradores pueden agregar, actualizar y eliminar productos.
  - Visualización de productos en distintas categorías.
  
- **Carrito de Compras:**
  - Agregar productos al carrito.
  - Eliminar productos o vaciar el carrito completo.
  - Ver resumen de compra antes de realizar el pago.

- **Finalización de Compra:**
  - Verificación de stock antes de la compra.
  - Generación de un ticket de compra con un ID único.
  - Los productos comprados se restan automáticamente del inventario.

- **Middleware de Seguridad:** Implementación de un middleware que asegura que solo los usuarios autenticados puedan modificar el carrito.

## Tecnologías Usadas

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (Mongoose ORM)
  - Passport.js (Autenticación)
  - Handlebars (Motor de Plantillas)

- **Frontend:**
  - HTML/CSS (Bootstrap + Estilo personalizado)
  - JavaScript (Interactividad en el carrito y el proceso de compra)
  
## Estructura del Proyecto

El proyecto sigue una arquitectura basada en el patrón MVC (Modelo-Vista-Controlador):

- **`/dao`**: Contiene los modelos de base de datos (Producto, Carrito, etc.)
- **`/routes`**: Definición de las rutas para el backend.
- **`/views`**: Archivos Handlebars para las vistas.
- **`/public`**: Archivos estáticos como CSS, imágenes, JS, etc.
- **`/services`**: Lógica de negocio y servicios como la generación de tickets de compra.
