const express = require('express');
const cors = require('cors');
const userRoutes = require('./controllers/userController');
const taskRoutes = require('./controllers/taskController');
const viewRoutes = require('./controllers/viewController');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// router.get('/', getSample);
app.use('/api/users', userRoutes);
app.use('/addview', viewRoutes);
// app.use('/api/tasks', taskRoutes);

module.exports = app;