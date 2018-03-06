# dashd-prometheus-exporter
![dashd prometheus exporter logo](dashd-prometheus-exporter.png)

Dash headless wallet daemon exporter for Prometheus.

## Usage
```
docker run --name my-exporter -p 3000:3000 -e "rpcuser=myrpcuser" -e "rpcpassword=myrpcpassword" -e "rpchost=my-wallet" --link my-wallet lepetitbloc/dashd-prometheus-exporter
````

>An easy hack could be to directly use your wallet conf to feed your exporter `env`:
>```
>docker run --name my-exporter -p 3000:3000 -v /path/to/my/conf:/app/.env --link my-wallet lepetitbloc/dashd-prometheus-exporter
>```

## Licence
MIT