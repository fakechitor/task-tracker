package com.fakechitor.tasktrackerbackend.config;

import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConfig {

    public static final String TOPIC = "EMAIL_SENDING_TASKS";
    public static final String EVENT_TYPE = "REGISTRATION";

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, UserRegistrationEvent> producerFactory() {
        Map<String, Object> configure = new HashMap<>();
        configure.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configure.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        configure.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new DefaultKafkaProducerFactory<>(configure);
    }

    @Bean
    public KafkaTemplate<String, UserRegistrationEvent> kafkaTemplate() {
        return new KafkaTemplate<String, UserRegistrationEvent>(producerFactory());
    }
}
