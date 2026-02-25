const Project = require('../models/Project.model');

const getAllProjects = async (req, res) => {
  const projects = await Project.findAll({ where: { user_id: req.user.user_id } });
  res.status(200).json({ data: projects });
};

const getSingleProject = async (req, res) => {
  res.status(200).json({ data: req.project });
};

const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    const error = new Error('Title is required');
    error.status = 400;
    throw error;
  }

  const newProject = await Project.create({
    title,
    description: description,
    user_id: req.user.user_id,
  });
  res.status(201).json({
    message: 'Project created successfully',
    project: newProject,
  });
};

const updateProject = async (req, res) => {
  const { title, description } = req.body;

  if (title !== undefined) req.project.title = title;
  if (description !== undefined) req.project.description = description;

  await req.project.save();

  res.status(200).json({
    message: 'Project updated successfully',
    data: req.project,
  });
};

const deleteProject = async (req, res) => {
  await req.project.destroy();

  res.status(200).json({
    message: 'Project deleted successfully',
  });
};

module.exports = {
  getAllProjects,
  getSingleProject,
  createProject,
  updateProject,
  deleteProject,
};
