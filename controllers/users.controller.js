const User = require('../models/User.model');

const getAllUsers = async (req, res) => {
  const users = await User.findAll();

  res.status(200).json(users);
};

module.exports = {
  getAllUsers,
};
