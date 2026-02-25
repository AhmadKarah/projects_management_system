const Project = require('../models/Project.model');

const projectOwnership = async (req, res, next) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;

    const project = await Project.findOne({
      where: {
        project_id: projectID,
        user_id: userID,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'project not found' });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = projectOwnership;
