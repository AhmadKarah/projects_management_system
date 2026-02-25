const Project = require('../models/Project.model');

const verifyProjectOwnership = async (projectID, userID) => {
  const project = await Project.findOne({
    where: {
      project_id: projectID,
      user_id: userID,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  return project;
};

module.exports = verifyProjectOwnership;
