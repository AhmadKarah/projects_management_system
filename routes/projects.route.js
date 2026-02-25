const express = require('express');
const projectsController = require('../controllers/projects.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express();

router
  .route('/')
  .get(verifyToken, projectsController.getAllProjects)
  .post(verifyToken, projectsController.createProject);

router
  .route('/:id')
  .get(verifyToken, projectsController.getSingleProject)
  .patch(verifyToken, projectsController.updateProject)
  .delete(verifyToken, projectsController.deleteProject);

module.exports = router;
