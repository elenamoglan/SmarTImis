require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config/env');
const createTables = require('./utils/initDb');

const startServer = async () => {
  try {
    // Initialize DB
    await createTables();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
