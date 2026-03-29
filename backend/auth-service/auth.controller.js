const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide all fields');
    }
    const data = await authService.register(name, email, password);
    res.status(201).json(data);
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }
    const data = await authService.login(email, password);
    res.json(data);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      res.status(401);
    }
    next(error);
  }
};

module.exports = { register, login };
