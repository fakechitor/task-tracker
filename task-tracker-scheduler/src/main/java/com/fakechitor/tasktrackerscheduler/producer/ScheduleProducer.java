package com.fakechitor.tasktrackerscheduler.producer;

import com.fakechitor.tasktrackerscheduler.producer.event.ScheduleEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import static com.fakechitor.tasktrackerscheduler.config.KafkaConfig.EVENT_TYPE;
import static com.fakechitor.tasktrackerscheduler.config.KafkaConfig.TOPIC;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduleProducer {

    private final KafkaTemplate<String, ScheduleEvent> kafkaTemplate;

    public void send(ScheduleEvent event) {
        kafkaTemplate.send(TOPIC, EVENT_TYPE, event);
        log.info("Message sent successfully for email {}", event.email());
    }
}
