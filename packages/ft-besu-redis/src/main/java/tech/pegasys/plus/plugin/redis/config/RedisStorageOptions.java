package tech.pegasys.plus.plugin.redis.config;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import picocli.CommandLine;

@Builder
@Getter
@ToString
public class RedisStorageOptions {
  @CommandLine.Option(names = "--plugin-redis-storage-host")
  @Builder.Default private String host = "localhost";

  @CommandLine.Option(names = "--plugin-redis-storage-port")
  @Builder.Default private Integer port = 6379;
}
