package tech.pegasys.plus.plugin.redis.core;

import io.lettuce.core.api.sync.RedisCommands;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.SecureRandom;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@RunWith(JUnitPlatform.class)
public class RedisTransactionTest {

  @Mock private RedisCommands<byte[], byte[]> commands;
  private RedisTransaction redisTransaction;
  private byte[] key = randomBytes(32);
  private byte[] value = randomBytes(32);;

  @BeforeEach
  void setUp() {
    redisTransaction = new RedisTransaction(commands);
  }

  @Test
  void givenValidParameters_whenPut_thenSucceed() {
    redisTransaction.put(key, value);
    verify(commands).set(eq(key), eq(value));
  }

  @Test
  void givenValidParameters_whenRemove_thenSucceed() {
    redisTransaction.remove(key);
    verify(commands).del(eq(key));
  }

  private static byte[] randomBytes(final int size) {
    byte[] out = new byte[size];
    new SecureRandom().nextBytes(out);
    return out;
  }
}
