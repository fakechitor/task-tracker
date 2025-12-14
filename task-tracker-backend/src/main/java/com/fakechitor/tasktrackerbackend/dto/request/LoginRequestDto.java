package com.fakechitor.tasktrackerbackend.dto.request;

public record LoginRequestDto(
        String username,
        String password
) {
}
