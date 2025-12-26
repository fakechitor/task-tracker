package com.fakechitor.tasktrackerscheduler.repository;

import com.fakechitor.tasktrackerscheduler.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
