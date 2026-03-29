const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('./user.repository');
const { JWT_SECRET } = require('./env');

const register = async (name, email, password) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({ name, email, password_hash });

  return {
    user,
    token: generateToken(user.id)
  };
};

const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  delete user.password_hash;

  return {
    user,
    token: generateToken(user.id)
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { register, login };
