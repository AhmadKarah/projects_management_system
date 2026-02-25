const express = require('express');
const sequelize = require('./config/database');

const app = express();
app.use(express.json());

const authRouter = require('./routes/auth.route');
const projectsRouter = require('./routes/projects.route');
const tasksRouter = require('./routes/tasks.route');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectID/tasks', tasksRouter);
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ force: false });
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
