package uml.memo;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class AppConfiguration {
    @Value("${memcached.host}")
    private String memcachedHost;

    @Value("${memcached.port}")
    private int memcachedPort;

    @Bean
    public MemcachedClient memcachedClient() throws IOException {
        MemcachedClient client = new XMemcachedClient(memcachedHost, memcachedPort);
        return client;
    }
}
