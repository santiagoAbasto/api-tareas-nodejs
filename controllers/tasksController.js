const db = require('../db/database');

// Obtener todas las tareas
exports.getAllTasks = (req, res) => {
  const query = 'SELECT * FROM tasks ORDER BY fechaCreacion DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener tareas:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(rows);
  });
};

// Crear una nueva tarea
exports.createTask = (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || titulo.length > 100) {
    return res.status(400).json({ error: 'El campo título es obligatorio y debe tener como máximo 100 caracteres.' });
  }

  if (descripcion && descripcion.length > 500) {
    return res.status(400).json({ error: 'La descripción no puede exceder los 500 caracteres.' });
  }

  const query = `
    INSERT INTO tasks (titulo, descripcion)
    VALUES (?, ?)
  `;

  db.run(query, [titulo, descripcion], function (err) {
    if (err) {
      console.error('❌ Error al crear tarea:', err.message);
      return res.status(500).json({ error: 'Error al crear la tarea' });
    }

    // Recuperar la tarea recién insertada
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('❌ Error al recuperar tarea creada:', err.message);
        return res.status(500).json({ error: 'Error al recuperar la tarea creada' });
      }
      
      global.emitNewTask(row); // para la implementacion del socket

      res.status(201).json(row);
    });
  });
};

// Actualizar el estado de una tarea
exports.updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'El campo status es obligatorio.' });
  }

  const query = `
    UPDATE tasks
    SET status = ?, fechaActualizacion = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [status, id], function (err) {
    if (err) {
      console.error('❌ Error al actualizar tarea:', err.message);
      return res.status(500).json({ error: 'Error al actualizar la tarea' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    global.emitTaskUpdated(id, status); // para la implementacion del socket


    res.json({ id: parseInt(id), status });
  });
};

// Eliminar una tarea
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tasks WHERE id = ?';

  db.run(query, [id], function (err) {
    if (err) {
      console.error('❌ Error al eliminar tarea:', err.message);
      return res.status(500).json({ error: 'Error al eliminar la tarea' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    global.emitTaskDeleted(id); // Para implementacion del Socket


    res.json({ message: 'Tarea eliminada correctamente' });
  });
};
