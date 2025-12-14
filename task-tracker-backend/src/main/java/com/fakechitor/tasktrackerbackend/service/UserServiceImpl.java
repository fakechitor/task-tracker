package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.exception.UserNotFoundException;
import com.fakechitor.tasktrackerbackend.model.User;
import com.fakechitor.tasktrackerbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername((username)).orElseThrow(
                () -> new UserNotFoundException("User not found with username: " + username));
    }

    @Override
    public boolean isExistsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isExistsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
