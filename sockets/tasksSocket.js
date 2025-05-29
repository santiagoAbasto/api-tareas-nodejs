module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('🔌 Cliente conectado:', socket.id);
  
      // Se pueden escuchar eventos del cliente si se desea
      socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
      });
    });
  
    // Guardar los métodos globales de emisión para usar en el backend
    global.emitNewTask = (task) => {
      io.emit('newTask', task);
    };
  
    global.emitTaskUpdated = (taskId, newStatus) => {
      io.emit('taskUpdated', { id: taskId, status: newStatus });
    };
  
    global.emitTaskDeleted = (taskId) => {
      io.emit('taskDeleted', { id: taskId });
    };
  };