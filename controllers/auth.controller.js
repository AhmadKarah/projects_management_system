const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'email already used' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(401).json('wrong password');
    }

    const token = await generateToken({ user_id: user.user_id, email: user.email });

    res.status(200).json({ msg: 'Welcome', data: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  register,
  login,
};
