// Importar dependencias principales
const express = require('express');              // Framework web para crear servidores HTTP
const path = require('path');                    // Módulo de Node.js para trabajar con rutas de archivos
const cors = require('cors');                    // Middleware para habilitar CORS
const tasksRoutes = require('./routes/tasks');   // Importar las rutas definidas para tareas

// Inicializar la aplicación de Express
const app = express();

// Middleware global
app.use(cors());                // Permitir solicitudes desde otros orígenes (Cross-Origin Resource Sharing)
app.use(express.json());        // Habilita el parseo automático de JSON en el cuerpo de las solicitudes

// Servir archivos estáticos desde la carpeta "public"
// Esto es útil si tienes un frontend o interfaz web dentro de esa carpeta
app.use(express.static(path.join(__dirname, 'public')));

// Montar las rutas de tareas bajo el prefijo /tasks
// Todas las rutas definidas en routes/tasks.js estarán accesibles desde /tasks
app.use('/tasks', tasksRoutes);

// Middleware para manejar rutas no encontradas (404)
// Si ninguna de las rutas anteriores coincide, se devuelve un error JSON
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar la aplicación para ser utilizada desde otros archivos, como server.js
module.exports = app;
