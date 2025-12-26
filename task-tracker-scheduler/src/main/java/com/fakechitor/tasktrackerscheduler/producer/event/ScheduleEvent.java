package com.fakechitor.tasktrackerscheduler.producer.event;

public record ScheduleEvent(
        String email,
        String title,
        String description
) {

}
