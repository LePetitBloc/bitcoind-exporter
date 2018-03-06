const { resolve } = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const helmet = require('helmet');
const compression = require('compression');
const createJsonRpcClient = require('dashd-client');
const { register, Gauge } = require('prom-client');

const {
    label = 'wallet',
    symbol = 'DASH',
    rpcuser = 'rpcuser',
    rpcpassword = 'rpcpassword',
    rpchost = '127.0.0.1',
    rpcport = '9998',
    rpcscheme = 'http',
} = process.env;

const balanceMetric = new Gauge({
    name: 'balance',
    help: `Wallet balance in ${symbol}`,
    labelNames: ['wallet_info', rpcuser]
});
const lastBlockTimeMetric = new Gauge({
    name: 'last_block_time',
    help: 'Time of the last synced block',
    labelNames: ['wallet_info', rpcuser]
});
const difficultyMetric = new Gauge({
    name: 'difficulty',
    help: 'The proof-of-work difficulty as a multiple of the minimum difficulty',
    labelNames: ['blockchain_info', rpcuser]
});

const jsonRPCClient = createJsonRpcClient({
    rpcuser,
    rpcpassword,
    rpchost,
    rpcport,
    rpcscheme,
});

const port = 3000;
const app = express();

app.use(compression());
app.use(helmet());
app.use(serveStatic(resolve('./public')));

app.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType);

    const walletInfoPromise = jsonRPCClient.request('getwalletinfo');
    const bestBlockInfoPromise = jsonRPCClient
        .request('getbestblockhash')
        .then(hash => jsonRPCClient.request('getblock', hash))
    ;
    const difficultyPromise = jsonRPCClient.request('getdifficulty');

    Promise
        .all([
            walletInfoPromise,
            bestBlockInfoPromise,
            difficultyPromise,
        ])
        .then(([walletInfo, bestBlockInfo, difficulty]) => {
            balanceMetric.set(walletInfo.balance);
            lastBlockTimeMetric.set(bestBlockInfo.time);
            difficultyMetric.set(difficulty);

            res.end(register.metrics());
        }).catch((error) =>  res.status(500).send(error))
    ;
});

app.use((req, res) => {
    console.warn(`Requested URL ${req.url} resulted in a 404 not found error.`);

    res.status(404).send('This metric doesn\'t exists');
});

app.listen(port, () => console.info(`Wallet exporter ${symbol} '${label}' http server listening on port ${port}.`));

process.on('SIGINT', () => {
    console.info(`wallet-exporter ${symbol} '${label}' http server gracefully shutting down from SIGINT (Ctrl-C)`);
    process.exit(0);
});