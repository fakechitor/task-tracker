package com.fakechitor.tasktrackerbackend.repository;

import com.fakechitor.tasktrackerbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId")
    List<Task> findAllByUserId(Long userId);
}
