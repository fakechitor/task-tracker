package com.fakechitor.tasktrackerbackend.producer;

import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserProducer {
    private static final String TOPIC = "user_topic";

    private final KafkaTemplate<String, UserRegistrationEvent> kafkaTemplate;

    public void sendRegistrationEvent(UserRegistrationEvent event) {
        kafkaTemplate.send(TOPIC, "sad", event);
        log.info("Registered user: {}", event);
    }
}
