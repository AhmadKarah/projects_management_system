const Task = require('../models/Task.model');
const validateTaskInput = require('../utils/validateTask');

const getAllTasks = async (req, res) => {
  const tasks = await req.project.getTasks();

  res.status(200).json({ data: tasks });
};

const getSingleTask = async (req, res) => {
  res.status(200).json({ data: req.task });
};

const createTask = async (req, res) => {
  const { title, status, priority } = req.body;

  if (!title) {
    const error = new Error('Title is required');
    error.status = 400;
    throw error;
  }

  validateTaskInput({ status, priority });

  const newTask = await Task.create({
    title,
    status: status || 'pending',
    priority: priority || 'medium',
    project_id: req.project.project_id,
  });

  res.status(201).json({
    message: 'Task created successfully',
    data: newTask,
  });
};

const updateTask = async (req, res) => {
  const { title, status, priority } = req.body;

  validateTaskInput({ status, priority });

  if (title !== undefined) req.task.title = title;
  if (status !== undefined) req.task.status = status;
  if (priority !== undefined) req.task.priority = priority;

  await req.task.save();

  res.status(200).json({
    message: 'Task updated successfully',
    data: req.task,
  });
};

const deleteTask = async (req, res) => {
  await req.task.destroy();

  res.status(200).json({
    message: 'Task deleted successfully',
  });
};

module.exports = {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
};
