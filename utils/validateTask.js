const constants = require('./constants');

const validateTaskInput = ({ status, priority }) => {
  if (status && !constants.statusOptions.includes(status)) {
    const error = new Error(`Status must be one of: ${constants.statusOptions.join(', ')}`);
    error.status = 400;
    throw error;
  }

  if (priority && !constants.priorityOptions.includes(priority)) {
    const error = new Error(`Priority must be one of: ${constants.priorityOptions.join(', ')}`);
    error.status = 400;
    throw error;
  }
};

module.exports = validateTaskInput;
