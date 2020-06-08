package tech.pegasys.plus.plugin.redis.core;

import io.lettuce.core.api.sync.RedisCommands;
import org.hyperledger.besu.plugin.services.exception.StorageException;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorageTransaction;

public class RedisTransaction implements KeyValueStorageTransaction {

  private final RedisCommands<byte[], byte[]> commands;

  public RedisTransaction(final RedisCommands<byte[], byte[]> commands) {
    this.commands = commands;
    // commands.multi();
  }

  @Override
  public void put(byte[] key, byte[] value) {
    commands.set(key, value);
  }

  @Override
  public void remove(byte[] key) {
    commands.del(key);
  }

  @Override
  public void commit() throws StorageException {
    /*final TransactionResult result = commands.exec();
    if (result.wasDiscarded()) {
      throw new StorageException("Transaction discarded");
    }*/
  }

  @Override
  public void rollback() {
    // commands.discard();
  }
}
