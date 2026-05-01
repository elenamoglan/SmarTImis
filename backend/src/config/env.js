module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev_fallback_secret_for_ci' : undefined),
  NODE_ENV: process.env.NODE_ENV || 'development',
};
