const express = require('express');
const cors = require('cors');
const userRoutes = require('./controllers/userController');
const taskRoutes = require('./controllers/taskController');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// router.get('/', getSample);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;
