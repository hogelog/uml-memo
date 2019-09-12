package uml.memo.service;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.exception.MemcachedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeoutException;

@Service
public class MemcachedService {
    @Value("${memcached.expiration}")
    private int defaultExpiration;

    @Value("${memcached.namespace}")
    private String namespace;

    public static class Exception extends java.lang.Exception {
        public Exception(java.lang.Exception e) {
            super(e);
        }
    }

    @Autowired
    MemcachedClient client;

    public Optional<byte[]> get(String key) throws Exception {
        try {
            byte[] data = client.get(namespace + key);
            return data != null ? Optional.of(data) : Optional.empty();
        } catch (TimeoutException|InterruptedException|MemcachedException e) {
            throw new Exception(e);
        }
    }

    public void put(String key, byte[] data) throws Exception {
        put(key, data, defaultExpiration);
    }

    public void put(String key, byte[] data, int expiration) throws Exception {
        try {
            client.set(namespace + key, expiration, data);
        } catch (TimeoutException|InterruptedException|MemcachedException e) {
            throw new Exception(e);
        }
    }
}
