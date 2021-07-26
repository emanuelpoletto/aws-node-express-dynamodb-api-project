const serverless = require('serverless-http');

const routes = require('./routes');

module.exports.usersApi = serverless(routes);
