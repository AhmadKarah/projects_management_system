const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./routes/auth.route');
const projectsRouter = require('./routes/projects.route');
const tasksRouter = require('./routes/tasks.route');
const usersRouter = require('./routes/users.route');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectID/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ force: false });
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
