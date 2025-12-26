package com.fakechitor.tasktrackeremailsender.service;

import com.fakechitor.tasktrackeremailsender.dto.EmailMessage;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Value("${resend.api}")
    private String resendApi;

    @Value("${resend.email}")
    private String resendEmail;

    private final Resend resend = new Resend(resendApi);

    @Override
    public void send(EmailMessage emailMessage) {
        String senderEmail = String.format("Task tracker <%s>", resendEmail);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(senderEmail)
                .to(emailMessage.email())
                .subject(emailMessage.title())
                .html(emailMessage.description())
                .build();
        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            log.error("Send email failed!", e);
        }
    }
}