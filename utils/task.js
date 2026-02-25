const Task = require('../models/Task.model');

const verifyTaskOwnership = async (taskID, projectID) => {
  const task = await Task.findOne({
    where: {
      task_id: taskID,
      project_id: projectID,
    },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  return task;
};

module.exports = verifyTaskOwnership;
