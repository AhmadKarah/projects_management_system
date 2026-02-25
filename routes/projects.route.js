const express = require('express');
const projectsController = require('../controllers/projects.controller');
const verifyToken = require('../middlewares/verifyToken');
const projectOwnership = require('../middlewares/projectOwnership');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

router.use(verifyToken);

router
  .route('/')
  .get(asyncWrapper(projectsController.getAllProjects))
  .post(asyncWrapper(projectsController.createProject));

router
  .route('/:projectID')
  .get(projectOwnership, asyncWrapper(projectsController.getSingleProject))
  .patch(projectOwnership, asyncWrapper(projectsController.updateProject))
  .delete(projectOwnership, asyncWrapper(projectsController.deleteProject));

module.exports = router;
