package com.fakechitor.tasktrackerbackend.dto.request;

import java.time.LocalDate;

public record TaskRequestDto(
        Long user_id,
        String title,
        String description,
        LocalDate deadline,
        Short priority
) {
}
