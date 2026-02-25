const express = require('express');
const tasksController = require('../controllers/tasks.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router({ mergeParams: true });

router.route('/').get(verifyToken, tasksController.getAllTasks).post(verifyToken, tasksController.createTask);

router
  .route('/:taskID')
  .get(verifyToken, tasksController.getSingleTask)
  .patch(verifyToken, tasksController.updateTask)
  .delete(verifyToken, tasksController.deleteTask);

module.exports = router;
