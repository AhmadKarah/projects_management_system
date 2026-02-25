const Project = require('../models/Project.model');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { user_id: req.user.user_id } });

    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSingleProject = async (req, res) => {
  try {
    res.status(200).json({ data: req.project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newProject = await Project.create({
      title,
      description: description || null,
      user_id: req.user.user_id,
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
    const { title, description } = req.body;

    if (title !== undefined) req.project.title = title;
    if (description !== undefined) req.project.description = description;

    await req.project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      data: req.project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await req.project.destroy();

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
