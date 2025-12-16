package com.fakechitor.tasktrackerbackend.controller;

import com.fakechitor.tasktrackerbackend.dto.response.TaskStatResponseDto;
import com.fakechitor.tasktrackerbackend.service.TaskStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/tasks/stats")
@RequiredArgsConstructor
public class TaskStatController {

    private final TaskStatService taskStatService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskStatResponseDto> getTaskStats(@PathVariable Long id) {
        return ResponseEntity.ok(taskStatService.getStatByUserId(id));
    }
}
