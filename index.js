const createServer = require('./createServer');
const metricsHandler = require('./metricsHandler');

const app = createServer(metricsHandler);

module.exports = app;