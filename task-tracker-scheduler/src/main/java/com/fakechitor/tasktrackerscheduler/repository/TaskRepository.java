package com.fakechitor.tasktrackerscheduler.repository;

import com.fakechitor.tasktrackerscheduler.model.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.user.id = :id AND t.status NOT IN ('FINISHED', 'CANCELLED')")
    List<Task> findNotCompletedByUserId(Long id, Pageable pageable);

    @Query(value = "SELECT * FROM tasks t WHERE t.user_id = :id AND t.status = 'FINISHED' " +
            "AND t.updated_at BETWEEN NOW() - INTERVAL '1 day' AND NOW() LIMIT(5)", nativeQuery = true)
    List<Task> findCompletedTodayByUserId(Long id);
}
