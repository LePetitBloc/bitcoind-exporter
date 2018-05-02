# bitcoind-prometheus-exporter

[![NPM package version][npm-svg]][npm-url]
[![Docker Build Status][hub-svg]][hub-url]

Bitcoind wallet metrics **Prometheus** exporter.

> `bitcoind-prometheus-exporter` is compatible with most **bitcoin** forks.

Produce **blockchain**, **wallet** and **addresses** metrics.
Most relevant metrics are:
* wallet total balance
* wallet version
* if the wallet is unlocked
* available (spendable) balance for each managed addresses (and watched addresses)
* best block time and index
* ...

## Usage
Edit the `.env` environment file to suit your needs and run:
```
npm start
```
> `bitcoind-prometheus-exporter` uses the `bitcoind` **JSON-RPC** API under the hood and need those credentials:
> ```
>rpcuser=test
>rpcpassword=1cf98b57-5i09-4fa1-9c07-2e28cb2cb47b
>```

## Usage with other wallets
The following environment variables are available, that should be enough for *any* **bitcoin** forks:
> ```
>ticker=DASH
>rpcuser=test
>rpcpassword=1cf98b57-5i09-4fa1-9c07-2e28cb2cb47b
>rpchost=127.0.0.1
>rpcport=9999
>rpcscheme=http
>```

### Docker
```
docker run --name my-exporter -p 3000:3000 -e "rpcuser=myrpcuser" -e "rpcpassword=myrpcpassword" -e "rpchost=my-wallet" --link my-wallet lepetitbloc/bitcoind-prometheus-exporter
````

>An easy hack could be to directly use your wallet conf to feed your exporter `env`:
>```
>docker run --name my-exporter -p 3000:3000 -v /path/to/my/conf:/app/.env --link my-wallet lepetitbloc/bitcoind-prometheus-exporter
>```

## Example
When visiting the metrics URL http://localhost:3000/metrics the following **metrics** are produced:
```
# HELP best_block_index The block height or index
# TYPE best_block_index gauge
best_block_index 69019

# HELP best_block_timestamp_seconds The block time in seconds since epoch (Jan 1 1970 GMT)
# TYPE best_block_timestamp_seconds gauge
best_block_timestamp_seconds 1522746083

# HELP chain_difficulty The proof-of-work difficulty as a multiple of the minimum difficulty
# TYPE chain_difficulty gauge
chain_difficulty 3511060552899.72

# HELP wallet_version the wallet version
# TYPE wallet_version gauge
wallet_version{ticker="BTC"} 71000

# HELP wallet_balance_total the total balance of the wallet
# TYPE wallet_balance_total gauge
wallet_balance_total{status="unconfirmed"} 2.7345
wallet_balance_total{status="immature"} 0
wallet_balance_total{status="confirmed"} 42.73453501

# HELP wallet_transactions_total the total number of transactions in the wallet
# TYPE wallet_transactions_total gauge
wallet_transactions_total 77

# HELP wallet_key_pool_oldest_timestamp_seconds the timestamp of the oldest pre-generated key in the key pool
# TYPE wallet_key_pool_oldest_timestamp_seconds gauge
wallet_key_pool_oldest_timestamp_seconds 1516231938

# HELP wallet_key_pool_size_total How many new keys are pre-generated.
# TYPE wallet_key_pool_size_total gauge
wallet_key_pool_size_total 1000

# HELP wallet_unlocked_until_timestamp_seconds the timestamp that the wallet is unlocked for transfers, or 0 if the wallet is locked
# TYPE wallet_unlocked_until_timestamp_seconds gauge
wallet_unlocked_until_timestamp_seconds 0

# HELP wallet_pay_tx_fee_per_kilo_bytes the transaction fee configuration, set in Unit/kB
# TYPE wallet_pay_tx_fee_per_kilo_bytes gauge
wallet_pay_tx_fee_per_kilo_bytes 0

# HELP address_balance_total address balance
# TYPE address_balance_total gauge
address_balance_total{address="1FxZE15d8bt381EuDckdDdp7vw8FUiLzu6"} 41.00683469
address_balance_total{address="1QAm6J6jLmcm7ce87ujrSdmjPNX9fgRUYZ"} 1.72770032
```

## Resources
* https://prometheus.io/
* https://en.bitcoin.it/wiki/API_reference_(JSON-RPC)

## Licence
MIT

[npm-svg]: https://img.shields.io/npm/v/bitcoind-prometheus-exporter.svg
[npm-url]: https://npmjs.org/package/bitcoind-prometheus-exporter
[hub-url]: https://hub.docker.com/r/lepetitbloc/bitcoind-prometheus-exporter/
[hub-svg]: https://img.shields.io/docker/pulls/lepetitbloc/bitcoind-prometheus-exporter.svg
