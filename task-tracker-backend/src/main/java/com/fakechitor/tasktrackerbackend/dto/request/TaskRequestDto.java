package com.fakechitor.tasktrackerbackend.dto.request;

import com.fakechitor.tasktrackerbackend.util.TaskStatus;

import java.time.LocalDate;

public record TaskRequestDto(
        Long user_id,
        String title,
        String description,
        TaskStatus status,
        LocalDate deadline,
        Short priority
) {
}
