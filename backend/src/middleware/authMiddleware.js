const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const userRepository = require('../modules/users/user.repository');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await userRepository.findUserById(decoded.id);
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      const message = error.message === 'Not authorized, user not found' 
        ? error.message 
        : 'Not authorized, token failed';
      next(new Error(message));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('User role is not authorized to access this route');
    }
    next();
  };
};

module.exports = { protect, authorize };
