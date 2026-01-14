const db = require('../../config/db');

const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at
  `;
  const result = await db.query(query, [name, email, passwordHash]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT id, name, email, role FROM users WHERE id = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findAdmins = async () => {
  const result = await db.query(
      `SELECT * FROM users WHERE role = 'ADMIN'`
  );
  return result.rows;
}

module.exports = { createUser, findUserByEmail, findUserById, findAdmins };
