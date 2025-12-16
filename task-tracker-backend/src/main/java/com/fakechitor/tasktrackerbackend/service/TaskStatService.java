package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.dto.response.TaskResponseDto;
import com.fakechitor.tasktrackerbackend.dto.response.TaskStatResponseDto;
import com.fakechitor.tasktrackerbackend.util.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskStatService {

    private final TaskService taskService;

    public TaskStatResponseDto getStatByUserId(Long userId) {
        List<TaskResponseDto> tasks = taskService.findAll(userId);

        return countStat(tasks);
    }

    private TaskStatResponseDto countStat(List<TaskResponseDto> tasks) {
        Integer total = tasks.size();

        Map<TaskStatus, Long> amountByStatus = tasks.stream()
                .collect(Collectors.groupingBy(TaskResponseDto::status, Collectors.counting()));

        Long overdue = tasks.stream()
                .filter(task -> task.deadline().isBefore(LocalDate.now()))
                .count();

        return new TaskStatResponseDto(total, amountByStatus, overdue);
    }
}
