const express = require('express');
const tasksController = require('../controllers/tasks.controller');
const verifyToken = require('../middlewares/verifyToken');
const projectOwnership = require('../middlewares/projectOwnership');
const taskOwnership = require('../middlewares/taskOwnership');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(projectOwnership);

router.route('/').get(tasksController.getAllTasks).post(tasksController.createTask);

router
  .route('/:taskID')
  .use(taskOwnership)
  .get(tasksController.getSingleTask)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
