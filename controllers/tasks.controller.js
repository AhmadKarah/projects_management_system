const Task = require('../models/Task.model');
const constants = require('../utils/constants');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { project_id: req.project.project_id },
    });

    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSingleTask = async (req, res) => {
  try {
    res.status(200).json({ data: req.task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (status && !constants.statusOptions.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${constants.statusOptions.join(', ')}` });
    }

    if (priority && !constants.priorityOptions.includes(priority)) {
      return res.status(400).json({ error: `Priority must be one of: ${constants.priorityOptions.join(', ')}` });
    }

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
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, status, priority } = req.body;

    if (title !== undefined) req.task.title = title;

    if (status !== undefined && !constants.statusOptions.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (status !== undefined) req.task.status = status;

    if (priority !== undefined && !constants.priorityOptions.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (priority !== undefined) req.task.priority = priority;

    await req.task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      data: req.task,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await req.task.destroy();

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
};
