package com.fakechitor.tasktrackerbackend.controller;

import com.fakechitor.tasktrackerbackend.dto.request.TaskRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.TaskResponseDto;
import com.fakechitor.tasktrackerbackend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks(@RequestParam Long userId) {
        return ResponseEntity.ok(taskService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskRequestDto taskRequestDto) {
        return ResponseEntity.ok(taskService.save(taskRequestDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id, @RequestBody TaskRequestDto taskRequestDto) {
        return ResponseEntity.ok(taskService.update(id, taskRequestDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.delete(id);
    }
}
