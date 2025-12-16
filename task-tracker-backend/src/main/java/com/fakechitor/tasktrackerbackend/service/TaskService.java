package com.fakechitor.tasktrackerbackend.service;

import com.fakechitor.tasktrackerbackend.dto.mapper.TaskMapper;
import com.fakechitor.tasktrackerbackend.dto.request.TaskRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.TaskResponseDto;
import com.fakechitor.tasktrackerbackend.exception.TaskNotFoundException;
import com.fakechitor.tasktrackerbackend.model.Task;
import com.fakechitor.tasktrackerbackend.repository.TaskRepository;
import com.fakechitor.tasktrackerbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final UserRepository userRepository;

    private final TaskRepository taskRepository;

    private final TaskMapper taskMapper;

    public TaskResponseDto findById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task does not exist"));
        return taskMapper.toDto(task);
    }

    public List<TaskResponseDto> findAll(Long userId) {
        return taskRepository.findAllByUserId(userId).stream()
                .map(taskMapper::toDto)
                .toList();
    }

    public TaskResponseDto save(TaskRequestDto taskRequestDto) {
        Task task = taskMapper.requestToModel(taskRequestDto);
        task.setUser(userRepository.getReferenceById(taskRequestDto.user_id()));

        Task taskSaved = taskRepository.save(task);
        return taskMapper.toDto(taskSaved);
    }

    @Transactional
    public TaskResponseDto update(Long taskId, TaskRequestDto taskRequestDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task does not exist"));

        if (taskRequestDto.title() != null) {
            task.setTitle(taskRequestDto.title());
        }
        if (taskRequestDto.description() != null) {
            task.setDescription(taskRequestDto.description());
        }
        if (taskRequestDto.deadline() != null) {
            task.setDeadline(taskRequestDto.deadline());
        }
        if (taskRequestDto.priority() != null) {
            task.setPriority(taskRequestDto.priority());
        }

        return taskMapper.toDto(task);
    }

    public void delete(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task does not exist"));
        taskRepository.delete(task);
    }
}
