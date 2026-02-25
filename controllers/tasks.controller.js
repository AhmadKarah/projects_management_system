const Task = require('../models/Task.model');
const Project = require('../models/Project.model');
const verifyProjectOwnership = require('../utils/project');
const verifyTaskOwnership = require('../utils/task');
const constants = require('../utils/constants');

const getAllTasks = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;

    await verifyProjectOwnership(projectID, userID);

    const tasks = await Task.findAll({
      where: { project_id: projectID },
    });

    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID, taskID } = req.params;

    await verifyProjectOwnership(projectID, userID);

    const task = await verifyTaskOwnership(taskID, projectID);

    res.status(200).json({ data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const createTask = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;
    const { title, status, priority } = req.body;

    await verifyProjectOwnership(projectID, userID);

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
      project_id: projectID,
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
    const userID = req.user.user_id;
    const { projectID, taskID } = req.params;
    const { title, status, priority } = req.body;

    await verifyProjectOwnership(projectID, userID);

    const task = await verifyTaskOwnership(taskID, projectID);

    if (title !== undefined) task.title = title;

    if (status !== undefined && !constants.statusOptions.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (status !== undefined) task.status = status;

    if (priority !== undefined && !constants.priorityOptions.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (priority !== undefined) task.priority = priority;

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID, taskID } = req.params;

    await verifyProjectOwnership(projectID, userID);

    const task = await verifyTaskOwnership(taskID, projectID);

    await task.destroy();

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
