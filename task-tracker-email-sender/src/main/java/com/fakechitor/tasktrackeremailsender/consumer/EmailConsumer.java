package com.fakechitor.tasktrackeremailsender.consumer;

import com.fakechitor.tasktrackeremailsender.dto.EmailMessage;
import com.fakechitor.tasktrackeremailsender.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailConsumer {
    public final String TOPIC = "EMAIL_SENDING_TASKS";
    private final EmailService emailService;

    @KafkaListener(topics = TOPIC)
    public void receiveRegistrationEvent(@Payload EmailMessage emailMessage) {
        emailService.send(emailMessage);
    }
}
