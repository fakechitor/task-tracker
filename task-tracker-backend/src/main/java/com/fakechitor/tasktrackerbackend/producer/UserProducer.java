package com.fakechitor.tasktrackerbackend.producer;

import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import static com.fakechitor.tasktrackerbackend.config.KafkaConfig.EVENT_TYPE;
import static com.fakechitor.tasktrackerbackend.config.KafkaConfig.TOPIC;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserProducer {

    private final KafkaTemplate<String, UserRegistrationEvent> kafkaTemplate;

    public void sendRegistrationEvent(UserRegistrationEvent event) {
        kafkaTemplate.send(TOPIC, EVENT_TYPE, event);
        log.info("Registered user: {}", event);
    }
}
