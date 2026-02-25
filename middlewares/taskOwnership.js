const Task = require('../models/Task.model');

const taskOwnership = async (req, res, next) => {
  try {
    const { projectID, taskID } = req.params;

    const task = await Task.findOne({
      where: {
        task_id: taskID,
        project_id: projectID,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }

    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = taskOwnership;
