const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
