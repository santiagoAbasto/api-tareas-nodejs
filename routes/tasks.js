const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Ruta para obtener todas las tareas
router.get('/', tasksController.getAllTasks);

// Ruta para crear una nueva tarea
router.post('/', tasksController.createTask);

// Ruta para actualizar el estado de una tarea
router.put('/:id', tasksController.updateTaskStatus);

// Ruta para eliminar una tarea
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
