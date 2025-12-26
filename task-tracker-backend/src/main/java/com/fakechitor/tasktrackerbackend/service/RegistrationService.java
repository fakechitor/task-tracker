package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.dto.request.RegistrationRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.AuthenticationResponseDto;
import com.fakechitor.tasktrackerbackend.model.User;
import com.fakechitor.tasktrackerbackend.producer.UserProducer;
import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import com.fakechitor.tasktrackerbackend.util.RegisterEmailText;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final UserService userService;

    private final UserProducer userProducer;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AuthenticationResponseDto register(RegistrationRequestDto request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user = userService.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        UserRegistrationEvent registrationEvent = new UserRegistrationEvent(
                user.getEmail(),
                RegisterEmailText.REGISTER_EMAIL_TITLE,
                RegisterEmailText.REGISTER_EMAIL_TEXT);
        userProducer.sendRegistrationEvent(registrationEvent);

        return new AuthenticationResponseDto(accessToken);
    }
}
