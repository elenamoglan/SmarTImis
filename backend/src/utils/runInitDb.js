require('dotenv').config();
const createTables = require('./initDb');

createTables()
  .then(() => {
    console.log('Database initialization complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
