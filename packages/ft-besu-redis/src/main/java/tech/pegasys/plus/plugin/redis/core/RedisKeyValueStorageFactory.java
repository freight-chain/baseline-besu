package tech.pegasys.plus.plugin.redis.core;

<<<<<<< HEAD
=======
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
import lombok.Builder;
import org.hyperledger.besu.plugin.services.BesuConfiguration;
import org.hyperledger.besu.plugin.services.MetricsSystem;
import org.hyperledger.besu.plugin.services.exception.StorageException;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorage;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorageFactory;
import org.hyperledger.besu.plugin.services.storage.SegmentIdentifier;
import tech.pegasys.plus.plugin.redis.config.RedisStorageOptions;

<<<<<<< HEAD
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;

@Builder
public class RedisKeyValueStorageFactory implements KeyValueStorageFactory {
  public static final String NAME = "redis-storage";
  @Builder.Default private RedisStorageOptions options = RedisStorageOptions.builder().build();
=======
@Builder
public class RedisKeyValueStorageFactory implements KeyValueStorageFactory {
  public static final String NAME = "redis-storage";
  @Builder.Default
  private RedisStorageOptions options = RedisStorageOptions.builder().build();
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
  private final AtomicInteger segmentCounter = new AtomicInteger(0);

  @Override
  public String getName() {
    return NAME;
  }

  @Override
<<<<<<< HEAD
  public KeyValueStorage create(
      final SegmentIdentifier segment,
      final BesuConfiguration configuration,
      final MetricsSystem metricsSystem)
      throws StorageException {
    return RedisKeyValueStorage.fromConfig(segmentCounter.getAndIncrement(), options);
    // return RedisKeyValueStorage.fromConfig(Arrays.hashCode(segment.getId()), options);
=======
  public KeyValueStorage create(final SegmentIdentifier segment,
                                final BesuConfiguration configuration,
                                final MetricsSystem metricsSystem)
      throws StorageException {
    return RedisKeyValueStorage.fromConfig(segmentCounter.getAndIncrement(),
                                           options);
    // return RedisKeyValueStorage.fromConfig(Arrays.hashCode(segment.getId()),
    // options);
>>>>>>> 12a2cb91bdf2cfd3a45be0f1a42def5082ab750e
  }

  @Override
  public boolean isSegmentIsolationSupported() {
    return true;
  }

  @Override
  public void close() {}
}
