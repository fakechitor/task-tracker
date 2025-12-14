package com.fakechitor.tasktrackerbackend.dto.mapper;

import com.fakechitor.tasktrackerbackend.model.User;
import com.fakechitor.tasktrackerbackend.producer.event.UserRegistrationEvent;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserRegistrationEvent toEvent(User user);
}
