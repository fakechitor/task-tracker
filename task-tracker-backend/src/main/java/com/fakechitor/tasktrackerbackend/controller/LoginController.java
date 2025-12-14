package com.fakechitor.tasktrackerbackend.controller;

import com.fakechitor.tasktrackerbackend.dto.request.LoginRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.AuthenticationResponseDto;
import com.fakechitor.tasktrackerbackend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> loginUser(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authenticationService.authenticate(loginRequestDto));
    }
}
