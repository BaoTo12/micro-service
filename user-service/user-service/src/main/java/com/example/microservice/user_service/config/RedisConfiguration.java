package com.example.microservice.user_service.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfiguration {
    @Value("${spring.cache.redis.time-to-live}")
    private Duration TIME_TO_LIVE;

    @Bean
    public RedisCacheManager redisCacheManager() {
        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig();

        GenericJackson2JsonRedisSerializer jsonRedisSerializer = createValueSerializer();

        cacheConfiguration.entryTtl(TIME_TO_LIVE);

        cacheConfiguration.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()));
        cacheConfiguration.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jsonRedisSerializer));


        return RedisCacheManager.builder()
                .cacheDefaults(cacheConfiguration)
                .build();
    }

    private GenericJackson2JsonRedisSerializer createValueSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.registerModule(new JavaTimeModule());

        objectMapper.activateDefaultTyping(
                BasicPolymorphicTypeValidator.builder()
                        .allowIfBaseType(Object.class)
                        .build(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }
}
