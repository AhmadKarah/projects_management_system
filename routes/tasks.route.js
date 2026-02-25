const express = require('express');
const tasksController = require('../controllers/tasks.controller');
const verifyToken = require('../middlewares/verifyToken');
const projectOwnership = require('../middlewares/projectOwnership');
const taskOwnership = require('../middlewares/taskOwnership');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(projectOwnership);

router.route('/').get(asyncWrapper(tasksController.getAllTasks)).post(asyncWrapper(tasksController.createTask));

router
  .route('/:taskID')
  .get(taskOwnership, asyncWrapper(tasksController.getSingleTask))
  .patch(taskOwnership, asyncWrapper(tasksController.updateTask))
  .delete(taskOwnership, asyncWrapper(tasksController.deleteTask));

module.exports = router;
