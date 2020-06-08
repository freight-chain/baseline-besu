package tech.pegasys.plus.plugin.redis.core;

import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.Builder;
import org.hyperledger.besu.plugin.services.BesuConfiguration;
import org.hyperledger.besu.plugin.services.MetricsSystem;
import org.hyperledger.besu.plugin.services.exception.StorageException;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorage;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorageFactory;
import org.hyperledger.besu.plugin.services.storage.SegmentIdentifier;
import tech.pegasys.plus.plugin.redis.config.RedisStorageOptions;

@Builder
public class RedisKeyValueStorageFactory implements KeyValueStorageFactory {
  public static final String NAME = "redis-storage";
  @Builder.Default
  private RedisStorageOptions options = RedisStorageOptions.builder().build();
  private final AtomicInteger segmentCounter = new AtomicInteger(0);

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public KeyValueStorage create(final SegmentIdentifier segment,
                                final BesuConfiguration configuration,
                                final MetricsSystem metricsSystem)
      throws StorageException {
    return RedisKeyValueStorage.fromConfig(segmentCounter.getAndIncrement(),
                                           options);
    // return RedisKeyValueStorage.fromConfig(Arrays.hashCode(segment.getId()),
    // options);
  }

  @Override
  public boolean isSegmentIsolationSupported() {
    return true;
  }

  @Override
  public void close() {}
}
