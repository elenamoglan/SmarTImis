const serverless = require('serverless-http');
const app = require('./src/app');

// Wrap the Express app. This creates the handler outside the execution block
// so it is cached between invocations.
const handler = serverless(app);

module.exports.api = async (event, context) => {
  return handler(event, context);
};