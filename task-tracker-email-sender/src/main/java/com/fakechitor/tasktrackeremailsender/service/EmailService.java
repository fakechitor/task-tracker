package com.fakechitor.tasktrackeremailsender.service;

import com.fakechitor.tasktrackeremailsender.dto.EmailMessage;

public interface EmailService {
    void send(EmailMessage emailMessage);
}
