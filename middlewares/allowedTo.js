module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error();
      error.message = 'This role is not authorized';
      return next(error);
    }
    next();
  };
};
