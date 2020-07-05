# Besu Redis Key value store plugin

## Use case

<<<<<<< HEAD
Using a Redis cluster as a storage engine for Besu enables to specify multiple types of Besu nodes depending on the features. This approach would allow us to have optimized nodes for query the database. RocksDB's lock mechanism makes harder to have multiple instances of Besu accessing the same database. Redis on the other hand enables this use case, we can imagine a categorisation of Besu nodes like the following:

- **besu-tx**: Handling of local transaction pool.
- **besu-sync**: Handling of blockchain synchronisation through Ethereum P2P network. 
=======
Using a Redis cluster as a storage engine for Besu enables to specify multiple
types of Besu nodes depending on the features. This approach would allow us to
have optimized nodes for query the database. RocksDB's lock mechanism makes
harder to have multiple instances of Besu accessing the same database. Redis on
the other hand enables this use case, we can imagine a categorisation of Besu
nodes like the following:

- **besu-tx**: Handling of local transaction pool.
- **besu-sync**: Handling of blockchain synchronisation through Ethereum P2P
  network.
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
- **besu-query**: Handling of database queries.

## Architecture

![architecture](./src/main/resources/architecture.png)

## Usage

### Start Redis server.
<<<<<<< HEAD
Using docker compose:
```shell script
docker-compose -f ./docker/redis.yml up -d
```
Redis + Web UI
```shell script
docker-compose -f ./docker/redis.yml -f ./docker/redis-ui.yml up -d
```
Go to http://127.0.0.1:8081

Remove Redis volume:
```shell script
docker volume rm -f docker_redis_data
```
### Build Redis plugin
```shell script
./gradlew assemble
```
### Start Besu with the redis storage plugin.
```shell script
./besu.sh --key-value-storage=redis-storage --plugin-redis-storage-host=localhost --plugin-redis-storage-port=6379
```
=======

Using docker compose:

```shell script
docker-compose -f ./docker/redis.yml up -d
```

Redis + Web UI

```shell script
docker-compose -f ./docker/redis.yml -f ./docker/redis-ui.yml up -d
```

Go to http://127.0.0.1:8081

Remove Redis volume:

```shell script
docker volume rm -f docker_redis_data
```

### Build Redis plugin

```shell script
./gradlew assemble
```

### Start Besu with the redis storage plugin.

```shell script
./besu.sh --key-value-storage=redis-storage --plugin-redis-storage-host=localhost --plugin-redis-storage-port=6379
```

Credit to:
[abdelhamidbakhta](https://github.com/abdelhamidbakhta/besu-storage-redis)
Licenese: Apache-2.0
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
