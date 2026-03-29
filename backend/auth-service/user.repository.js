const db = require('./db');

const createUser = async (user) => {
  const { name, email, password_hash } = user;
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at
  `;
  const result = await db.query(query, [name, email, password_hash]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT id, name, email, role, created_at FROM users WHERE id = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findAdmins = async () => {
  const query = `SELECT id, name, email FROM users WHERE role = 'ADMIN'`;
  const result = await db.query(query);
  return result.rows;
};

module.exports = { createUser, findUserByEmail, findUserById, findAdmins };
