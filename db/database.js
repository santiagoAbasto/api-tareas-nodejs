const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta absoluta al archivo .sqlite
const dbPath = path.resolve(__dirname, 'tasks.sqlite');

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos SQLite.');
});

// Crear la tabla 'tasks' si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL CHECK(length(titulo) <= 100),
      descripcion TEXT CHECK(length(descripcion) <= 500),
      status TEXT DEFAULT 'pendiente',
      fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error al crear la tabla de tareas:', err.message);
    } else {
      console.log('📦 Tabla de tareas verificada o creada correctamente.');
    }
  });
});

module.exports = db;
