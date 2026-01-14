const db = require('../config/db');

const createTables = async () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'ADMIN')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const issueTable = `
    CREATE TABLE IF NOT EXISTS issue_reports (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const notificationTable = `
      CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      report_id INTEGER REFERENCES issue_reports(id),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;


  try {
    await db.query(userTable);
    await db.query(issueTable);
    await db.query(notificationTable);
    console.log('Tables initialized successfully');
  } catch (err) {
    console.error('Error initializing tables', err);
    throw err;
  }
};

module.exports = createTables;
