const { resolve } = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const helmet = require('helmet');
const compression = require('compression');

const createServer = metricsHandler => {
    const port = 9439;
    const app = express();

    app.use(compression());
    app.use(helmet());
    app.use(serveStatic(resolve('./public')));

    app.get('/metrics', metricsHandler);

    app.use((req, res) => {
        console.warn(`Requested URL ${req.url} resulted in a 404 not found error.`);

        res.status(404).send('# This metric doesn\'t exists\n');
    });

    app.listen(port, () => console.info(`Wallet exporter started on http://localhost:${port}`));

    process.on('SIGINT', () => {
        console.info(`Wallet exporter gracefully shut down from SIGINT (Ctrl-C)`);
        process.exit(0);
    });

    return app;
};

module.exports = createServer;
