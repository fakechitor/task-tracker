package com.fakechitor.tasktrackerbackend.dto.response;

import com.fakechitor.tasktrackerbackend.util.TaskStatus;

import java.util.Map;

public record TaskStatResponseDto(
        Integer total,
        Map<TaskStatus, Long> amountByStatus,
        Long overdue
) {
}
