const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize task routes with io
const taskRoutes = require('./controllers/taskController')(io);
app.use('/api/tasks', taskRoutes);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('task-viewed', (data) => {
    socket.broadcast.emit('task-viewed', data);
  });

  socket.on('task-being-viewed', (data) => {
    socket.broadcast.emit('task-being-viewed', data);
  }); // Send to others except sender

  socket.on('task-view-ended', (data) => {
    socket.broadcast.emit('task-view-ended', {
      taskId: data.taskId,
      userId: data.userId
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
