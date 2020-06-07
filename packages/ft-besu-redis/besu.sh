#!/usr/bin/env bash
set -e

BESU_PATH=${ENV_BESU_PATH:-"besu"}

DIR="$PWD"
DATA_DIR="$DIR/out"
BESU_DATA="$DATA_DIR/besu"
PLUGIN_DIR="$DIR/build/libs/"

export BESU_OPTS=${ENV_BESU_OPTS:-"-Dbesu.plugins.dir=$PLUGIN_DIR"}
echo "Starting Besu with Redis storage plugin."
$BESU_PATH "$1" --data-path="$BESU_DATA" --rpc-http-enabled --network=dev --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --auto-log-bloom-caching-enabled=false

#--network=goerli --nat-method=UPNP
#--network=dev --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --auto-log-bloom-caching-enabled=false