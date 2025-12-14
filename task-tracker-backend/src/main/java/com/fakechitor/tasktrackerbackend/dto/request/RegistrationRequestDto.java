package com.fakechitor.tasktrackerbackend.dto.request;

public record RegistrationRequestDto(
        String username,
        String email,
        String password
) {
}
