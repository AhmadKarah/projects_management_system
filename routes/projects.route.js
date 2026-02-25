const express = require('express');
const projectsController = require('../controllers/projects.controller');
const verifyToken = require('../middlewares/verifyToken');
const projectOwnership = require('../middlewares/projectOwnership');

const router = express.Router();

router.use(verifyToken);

router.route('/').get(projectsController.getAllProjects).post(projectsController.createProject);

router
  .route('/:projectID')
  .use(projectOwnership)
  .get(projectsController.getSingleProject)
  .patch(projectsController.updateProject)
  .delete(projectsController.deleteProject);

module.exports = router;
