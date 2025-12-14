package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    boolean isExistsByEmail(String email);
    boolean isExistsByUsername(String username);
    User save(User user);
}