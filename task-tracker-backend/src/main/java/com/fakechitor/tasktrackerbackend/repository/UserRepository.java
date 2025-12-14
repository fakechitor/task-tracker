package com.fakechitor.tasktrackerbackend.repository;

import com.fakechitor.tasktrackerbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<UserDetails> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
