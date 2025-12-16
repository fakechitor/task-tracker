package com.fakechitor.tasktrackerbackend.dto.response;

import com.fakechitor.tasktrackerbackend.util.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponseDto(
        Long id,
        String title,
        String description,
        LocalDate deadline,
        TaskStatus status,
        Short priority,
        LocalDateTime createdAt
) {
}
