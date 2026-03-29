const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../env');
const axios = require('axios');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const authUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      // Fetch user from auth-service
      const userRes = await axios.get(`${authUrl}/api/users/${decoded.id}`);
      const user = userRes.data;

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed or auth service unavailable'));
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
