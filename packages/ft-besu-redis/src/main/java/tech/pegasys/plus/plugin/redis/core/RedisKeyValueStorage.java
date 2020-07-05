package tech.pegasys.plus.plugin.redis.core;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.Sets;
import io.lettuce.core.KeyScanCursor;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.codec.ByteArrayCodec;
<<<<<<< HEAD
=======
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Predicate;
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hyperledger.besu.plugin.services.exception.StorageException;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorage;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorageTransaction;
import tech.pegasys.plus.plugin.redis.config.RedisStorageOptions;

<<<<<<< HEAD
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Predicate;

=======
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
public class RedisKeyValueStorage implements KeyValueStorage {
  private static Logger LOG = LogManager.getLogger();

  private final RedisClient redisClient;
  private StatefulRedisConnection<byte[], byte[]> connection;
  private RedisCommands<byte[], byte[]> commands;

  public RedisKeyValueStorage(final RedisClient redisClient) {
    this.redisClient = redisClient;
    this.connect();
  }

  @VisibleForTesting
  void connect() {
    connection = redisClient.connect(new ByteArrayCodec());
    commands = connection.sync();
    LOG.info("Successfully connected to redis.");
  }

<<<<<<< HEAD
  public static RedisKeyValueStorage fromConfig(
      final Integer database, final RedisStorageOptions config) {
    return new RedisKeyValueStorage(
        RedisClient.create(
            RedisURI.Builder.redis(config.getHost(), config.getPort())
                .withDatabase(database)
                .build()));
=======
  public static RedisKeyValueStorage
  fromConfig(final Integer database, final RedisStorageOptions config) {
    return new RedisKeyValueStorage(RedisClient.create(
        RedisURI.Builder.redis(config.getHost(), config.getPort())
            .withDatabase(database)
            .build()));
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
  }

  @Override
  public void clear() throws StorageException {
    applyForAllKeys(key -> true, commands::del);
  }

  @Override
  public boolean containsKey(final byte[] key) throws StorageException {
    return get(key).isPresent();
  }

  @Override
  public Optional<byte[]> get(final byte[] key) throws StorageException {
    return Optional.ofNullable(commands.get(key));
  }

  @Override
<<<<<<< HEAD
  public long removeAllKeysUnless(final Predicate<byte[]> retainCondition) throws StorageException {
=======
  public long removeAllKeysUnless(final Predicate<byte[]> retainCondition)
      throws StorageException {
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
    return applyForAllKeys(retainCondition.negate(), commands::del);
  }

  @Override
  public Set<byte[]> getAllKeysThat(final Predicate<byte[]> returnCondition) {
    final Set<byte[]> returnedKeys = Sets.newIdentityHashSet();
    applyForAllKeys(returnCondition, returnedKeys::add);
    return returnedKeys;
  }

  @Override
  public KeyValueStorageTransaction startTransaction() throws StorageException {
    return new RedisTransaction(commands);
  }

  @Override
  public void close() {
    LOG.info("Shutting down redis connection.");
    connection.close();
    redisClient.shutdown();
  }

<<<<<<< HEAD
  private long applyForAllKeys(
      final Predicate<byte[]> condition, final Consumer<byte[]> keyConsumer) {
=======
  private long applyForAllKeys(final Predicate<byte[]> condition,
                               final Consumer<byte[]> keyConsumer) {
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
    long removedNodeCounter = 0;
    KeyScanCursor<byte[]> cursor = commands.scan();
    while (!cursor.isFinished()) {
      cursor = commands.scan(cursor);
      final List<byte[]> keys = cursor.getKeys();
      if (keys != null) {
        for (byte[] key : keys) {
          if (condition.test(key)) {
            removedNodeCounter++;
            keyConsumer.accept(key);
          }
        }
      }
    }
    return removedNodeCounter;
  }
}
