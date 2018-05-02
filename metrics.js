const { Gauge } = require('prom-client');

const bestBlockIndexMetric = new Gauge({
    name: 'best_block_index',
    help: 'The block height or index',
});
const bestBlockTimeMetric = new Gauge({
    name: 'best_block_timestamp_seconds',
    help: 'The block time in seconds since epoch (Jan 1 1970 GMT)',
});
const difficultyMetric = new Gauge({
    name: 'chain_difficulty',
    help: 'The proof-of-work difficulty as a multiple of the minimum difficulty',
});
const walletVersionMetric = new Gauge({
    name: 'wallet_version',
    help: 'the wallet version',
    labelNames: ['ticker']
});
const walletBalanceMetric = new Gauge({
    name: `wallet_balance_total`,
    help: `the total balance of the wallet`,
    labelNames: ['status'],
});
const walletTransationsMetric = new Gauge({
    name: 'wallet_transactions_total',
    help: 'the total number of transactions in the wallet',
});
const keyPoolOldestMetric = new Gauge({
    name: 'wallet_key_pool_oldest_timestamp_seconds',
    help: 'the timestamp of the oldest pre-generated key in the key pool',
});
const keyPoolSizeMetric = new Gauge({
    name: 'wallet_key_pool_size_total',
    help: 'How many new keys are pre-generated.',
});
const unlockedUntilMetric = new Gauge({
    name: 'wallet_unlocked_until_timestamp_seconds',
    help: 'the timestamp that the wallet is unlocked for transfers, or 0 if the wallet is locked',
});
const transactionFeeMetric = new Gauge({
    name: `wallet_pay_tx_fee_per_kilo_bytes`,
    help: `the transaction fee configuration, set in Unit/kB`,
});
const addressBalanceMetric = new Gauge({
    name: `address_balance_total`,
    help: `address balance`,
    labelNames: ['address']
});

module.exports = {
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
    addressBalanceMetric,
};
