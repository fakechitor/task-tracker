package com.fakechitor.tasktrackerbackend.producer.event;

public record UserRegistrationEvent(
     String email,
     String title,
     String description
) {
}
