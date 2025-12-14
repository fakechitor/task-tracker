package com.fakechitor.tasktrackerbackend.producer.event;

public record UserRegistrationEvent(
     String username,
     String email
) {
}
