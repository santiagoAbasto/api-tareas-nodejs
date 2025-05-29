// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket events
require('./sockets/tasksSocket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
