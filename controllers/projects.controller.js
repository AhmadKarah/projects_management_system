const Project = require('../models/Project.model');
const verifyProjectOwnership = require('../utils/project');

const getAllProjects = async (req, res) => {
  try {
    const userID = req.user.user_id;

    const projects = await Project.findAll({ where: { user_id: userID } });

    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSingleProject = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;

    const project = await verifyProjectOwnership(projectID, userID);

    res.status(200).json({ data: project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newProject = await Project.create({
      title,
      description: description || null,
      user_id: userID,
    });
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;
    const { title, description } = req.body;

    const project = await verifyProjectOwnership(projectID, userID);

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const userID = req.user.user_id;
    const { projectID } = req.params;

    const project = await verifyProjectOwnership(projectID, userID);

    await project.destroy();

    res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getSingleProject,
  createProject,
  updateProject,
  deleteProject,
};
