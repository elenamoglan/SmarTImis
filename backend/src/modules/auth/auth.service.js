const userRepository = require('../users/user.repository');
const { hashPassword, matchPassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');

const register = async (name, email, password) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepository.createUser(name, email, hashedPassword);

  const token = generateToken(user.id, user.role);
  return { user, token };
};

const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await matchPassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.role);
  
  // Return user without password
  const { password_hash, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};

module.exports = { register, login };
