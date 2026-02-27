const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const usersController = require('../controllers/users.controller');
const asyncWrapper = require('../utils/asyncWrapper.js');
const allowedTo = require('../middlewares/allowedTo.js');
const userRoles = require('../utils/userRoles.js');

const router = express.Router();

router.use(verifyToken);
router.use(allowedTo(userRoles.ADMIN));

router.route('/').get(asyncWrapper(usersController.getAllUsers));

module.exports = router;
