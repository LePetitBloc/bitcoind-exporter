# bitcoind-exporter

[![NPM package version][npm-svg]][npm-url]
[![Docker Build Status][hub-svg]][hub-url]

Bitcoind metrics **Prometheus** exporter.

> `bitcoind-exporter` is compatible with most **bitcoin** forks.

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
> `bitcoind-exporter` uses the `bitcoind` **JSON-RPC** API under the hood and need those credentials:
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
Using environment variables:
```
docker run -d --restart always --name my-exporter -p 9439:9439 -e "rpcuser=myrpcuser" -e "rpcpassword=myrpcpassword" -e "rpchost=my-wallet" --link my-wallet lepetitbloc/bitcoind-exporter
````

Using a `.env` file:
```
docker run -d --restart always --name my-exporter -p 9439:9439 -v /path/to/my/conf:/app/.env --link my-wallet lepetitbloc/bitcoind-exporter
```

>An easy hack could be to directly use your wallet conf to feed your exporter `env`:
>```
>docker run --name my-exporter -p 9439:9439 -v /path/to/my/conf:/app/.env --link my-wallet lepetitbloc/bitcoind-exporter
>```

## Example metrics
When visiting the metrics URL http://localhost:9439/metrics the following **metrics** are produced:
```
# HELP bitcoind_best_block_index The block height or index
# TYPE bitcoind_best_block_index gauge
bitcoind_best_block_index 69019

# HELP bitcoind_best_block_timestamp_seconds The block time in seconds since epoch (Jan 1 1970 GMT)
# TYPE bitcoind_best_block_timestamp_seconds gauge
bitcoind_best_block_timestamp_seconds 1522746083

# HELP bitcoind_chain_difficulty The proof-of-work difficulty as a multiple of the minimum difficulty
# TYPE bitcoind_chain_difficulty gauge
bitcoind_chain_difficulty 3511060552899.72

# HELP bitcoind_wallet_version the wallet version
# TYPE bitcoind_wallet_version gauge
bitcoind_wallet_version{ticker="BTC"} 71000

# HELP bitcoind_wallet_balance_total the total balance of the wallet
# TYPE bitcoind_wallet_balance_total gauge
bitcoind_wallet_balance_total{status="unconfirmed"} 2.7345
bitcoind_wallet_balance_total{status="immature"} 0
bitcoind_wallet_balance_total{status="confirmed"} 42.73453501

# HELP bitcoind_wallet_transactions_total the total number of transactions in the wallet
# TYPE bitcoind_wallet_transactions_total gauge
bitcoind_wallet_transactions_total 77

# HELP bitcoind_wallet_key_pool_oldest_timestamp_seconds the timestamp of the oldest pre-generated key in the key pool
# TYPE bitcoind_wallet_key_pool_oldest_timestamp_seconds gauge
bitcoind_wallet_key_pool_oldest_timestamp_seconds 1516231938

# HELP bitcoind_wallet_key_pool_size_total How many new keys are pre-generated.
# TYPE bitcoind_wallet_key_pool_size_total gauge
bitcoind_wallet_key_pool_size_total 1000

# HELP bitcoind_wallet_unlocked_until_timestamp_seconds the timestamp that the wallet is unlocked for transfers, or 0 if the wallet is locked
# TYPE bitcoind_wallet_unlocked_until_timestamp_seconds gauge
bitcoind_wallet_unlocked_until_timestamp_seconds 0

# HELP bitcoind_wallet_pay_tx_fee_per_kilo_bytes the transaction fee configuration, set in Unit/kB
# TYPE bitcoind_wallet_pay_tx_fee_per_kilo_bytes gauge
bitcoind_wallet_pay_tx_fee_per_kilo_bytes 0

# HELP bitcoind_address_balance_total address balance
# TYPE bitcoind_address_balance_total gauge
bitcoind_address_balance_total{address="1FxZE15d8bt381EuDckdDdp7vw8FUiLzu6"} 41.00683469
bitcoind_address_balance_total{address="1QAm6J6jLmcm7ce87ujrSdmjPNX9fgRUYZ"} 1.72770032
```

## Demo
You can test this exporter with `docker-compose`:
```
docker-compose up
```

## Resources
* https://prometheus.io/
* https://en.bitcoin.it/wiki/API_reference_(JSON-RPC)

## Licence
MIT

[npm-svg]: https://img.shields.io/npm/v/bitcoind-exporter.svg
[npm-url]: https://npmjs.org/package/bitcoind-exporter
[hub-url]: https://hub.docker.com/r/lepetitbloc/bitcoind-exporter/
[hub-svg]: https://img.shields.io/docker/pulls/lepetitbloc/bitcoind-exporter.svg