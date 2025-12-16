package com.fakechitor.tasktrackerbackend.dto.mapper;

import com.fakechitor.tasktrackerbackend.dto.request.TaskRequestDto;
import com.fakechitor.tasktrackerbackend.dto.response.TaskResponseDto;
import com.fakechitor.tasktrackerbackend.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {
    TaskResponseDto toDto(Task task);

    Task requestToModel(TaskRequestDto taskRequestDto);
}
