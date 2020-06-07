package tech.pegasys.plus.plugin.redis;

import com.google.auto.service.AutoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hyperledger.besu.plugin.BesuContext;
import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.services.PicoCLIOptions;
import org.hyperledger.besu.plugin.services.StorageService;
import org.hyperledger.besu.plugin.services.storage.KeyValueStorageFactory;
import tech.pegasys.plus.plugin.redis.config.RedisStorageOptions;
import tech.pegasys.plus.plugin.redis.core.RedisKeyValueStorageFactory;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

// The AutoService annotation (when paired with the corresponding annotation processor) will
// automatically handle adding the relevant META-INF files so Besu will load this plugin.
@AutoService(BesuPlugin.class)
public class RedisStoragePlugin implements BesuPlugin {
  private static Logger LOG = LogManager.getLogger();
  private static String PLUGIN_NAME = "redis-storage";

  private BesuContext context;
  private final RedisStorageOptions options = RedisStorageOptions.builder().build();
  private KeyValueStorageFactory factory;

  @Override
  public void register(final BesuContext context) {
    LOG.info("Registering plugin {}.", PLUGIN_NAME);
    this.context = context;
    context
        .getService(PicoCLIOptions.class)
        .ifPresentOrElse(
            this::handleCLIOptions, () -> LOG.error("Could not obtain PicoCLIOptions service."));
    context
        .getService(StorageService.class)
        .ifPresentOrElse(
            this::createAndRegister, () -> LOG.error("Could not obtain Storage service."));
  }

  private void handleCLIOptions(final PicoCLIOptions cmdLineOptions) {
    cmdLineOptions.addPicoCLIOptions(PLUGIN_NAME, options);
  }

  @Override
  public void start() {
    LOG.info("Starting plugin {}.", PLUGIN_NAME);
    LOG.info(options.toString());
  }

  private void createAndRegister(final StorageService service) {
    factory = RedisKeyValueStorageFactory.builder().options(options).build();
    LOG.info("Registering redis key value storage factory");
    service.registerKeyValueStorage(factory);
  }

  @Override
  public CompletableFuture<Void> reloadConfiguration() {
    LOG.warn("Configuration reloaded is not supported");
    return CompletableFuture.completedFuture(null);
  }

  @Override
  public void stop() {
    LOG.info("Stopping plugin {}.", PLUGIN_NAME);
  }

  @Override
  public Optional<String> getName() {
    return Optional.of(PLUGIN_NAME);
  }
}
