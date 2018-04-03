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
    symbol = 'BTC',
    rpcuser = 'rpcuser',
    rpcpassword = 'rpcpassword',
    rpchost = '127.0.0.1',
    rpcport = '9999',
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
                walletVersionMetric.set({ symbol }, walletversion);
                walletBalanceMetric.set({
                    unconfirmed: unconfirmed_balance,
                    immature: immature_balance,
                    confirmed: balance,
                }, balance);
                walletTransationsMetric.set(txcount);
                unlockedUntilMetric.set(unlocked_until);
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
        .catch((error) =>  res.status(500).send(error))
    ;
};

module.exports = metricsHandler;