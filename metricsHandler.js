const { createCall } = require('bitcoind-client');
const { register } = require('prom-client');
require('isomorphic-fetch');
const {
    bestBlockIndexMetric,
    bestBlockTimeMetric,
    difficultyMetric,
    walletVersionMetric,
    walletBalanceMetric,
    walletTransationsMetric,
    keyPoolOldestMetric,
    keyPoolSizeMetric,
    unlockedUntilMetric,
    transactionFeeMetric,
    addressBalanceMetric
} = require('./metrics');

const {
    ticker = 'BTC',
    rpcuser = 'rpcuser',
    rpcpassword = 'rpcpassword',
    rpchost = '127.0.0.1',
    rpcport = '8332',
    rpcscheme = 'http',
} = process.env;

const call = createCall({
    rpcuser,
    rpcpassword,
    rpchost,
    rpcport,
    rpcscheme,
});

const metricsHandler = (req, res) => {
    res.set('Content-Type', register.contentType);

    const listUnspentPromise = call('listunspent')
        .then(transactions => transactions.reduce((balances, transaction) => {
            balances[transaction.address] = (balances[transaction.address] || 0)  + transaction.amount;

            return balances;
        }, {}))
        .then(balances => Object
            .keys(balances)
            .forEach((address) => addressBalanceMetric.set({ address }, balances[address]))
        )
    ;
    const walletInfoPromise = call('getwalletinfo')
        .then(
            ({
                 unconfirmed_balance,
                 immature_balance,
                 balance,
                 walletversion,
                 txcount,
                 keypoololdest,
                 keypoolsize,
                 unlocked_until,
                 paytxfee,
             }) => {


                walletVersionMetric.set({ ticker }, walletversion);
                walletBalanceMetric.set({ status: 'unconfirmed' }, unconfirmed_balance);
                walletBalanceMetric.set({ status: 'immature' }, immature_balance);
                walletBalanceMetric.set({ status: 'confirmed' }, balance);
                walletTransationsMetric.set(txcount);
                unlockedUntilMetric.set(unlocked_until || 0);
                keyPoolOldestMetric.set(keypoololdest);
                keyPoolSizeMetric.set(keypoolsize);
                transactionFeeMetric.set(paytxfee);
            }
        )
    ;
    const bestBlockPromise = call('getbestblockhash')
        .then(hash => call('getblock', hash))
        .then(bestBlockInfo => {
            bestBlockIndexMetric.set(bestBlockInfo.height);
            bestBlockTimeMetric.set(bestBlockInfo.time);
        })
    ;
    const difficultyPromise = call('getdifficulty')
        .then(difficulty => difficultyMetric.set(difficulty))
    ;

    Promise.all([
        listUnspentPromise,
        walletInfoPromise,
        bestBlockPromise,
        difficultyPromise
    ])
        .then(() => res.end(register.metrics()))
        .catch((error) => {
            console.error(error);

            let code = 500;
            if (error.code === -28) {
                code = 503;
            } else if (error.code === 403) {
                code = 403;
            }

            return res.status(code).send(`# ${error.message}\n`)
        })
    ;
};

module.exports = metricsHandler;