package com.fakechitor.tasktrackeremailsender.dto;

public record EmailMessage(
        String email,
        String title,
        String description
) {
}
