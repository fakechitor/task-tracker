package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.dto.mapper.UserMapper;
import com.fakechitor.tasktrackerbackend.dto.request.LoginRequestDto;
import com.fakechitor.tasktrackerbackend.dto.request.RegistrationRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.AuthenticationResponseDto;
import com.fakechitor.tasktrackerbackend.model.User;
import com.fakechitor.tasktrackerbackend.producer.UserProducer;
import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserServiceImpl userService;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final UserProducer userProducer;

    private final UserMapper userMapper;

    public AuthenticationResponseDto register(RegistrationRequestDto request) {

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user = userService.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        UserRegistrationEvent registrationEvent = userMapper.toEvent(user);
        userProducer.sendRegistrationEvent(registrationEvent);

        return new AuthenticationResponseDto(accessToken);
    }

    public AuthenticationResponseDto authenticate(LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = (User) userService.loadUserByUsername(request.username());

        String accessToken = jwtService.generateAccessToken(user);

        return new AuthenticationResponseDto(accessToken);
    }
}
