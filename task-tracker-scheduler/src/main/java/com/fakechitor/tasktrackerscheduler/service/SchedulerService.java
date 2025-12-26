package com.fakechitor.tasktrackerscheduler.service;

import com.fakechitor.tasktrackerscheduler.model.Task;
import com.fakechitor.tasktrackerscheduler.model.User;
import com.fakechitor.tasktrackerscheduler.producer.ScheduleProducer;
import com.fakechitor.tasktrackerscheduler.producer.event.ScheduleEvent;
import com.fakechitor.tasktrackerscheduler.repository.TaskRepository;
import com.fakechitor.tasktrackerscheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {
    private final ScheduleProducer scheduleProducer;

    private final TaskRepository taskRepository;

    private final UserRepository userRepository;

    private static final String EMAIL_TITLE = "Your daily report";

    @Scheduled(cron = "0 0 0 * * *")
    public void sendDailyReport() {
        userRepository.findAll().forEach(this::sendDailyReportForUser);
    }

    private void sendDailyReportForUser(User user) {
        List<String> notCompleted = taskRepository.findNotCompletedByUserId(user.getId(), PageRequest.of(0, 10)).stream()
                .map(Task::getTitle)
                .toList();

        List<String> completedToday = taskRepository.findCompletedTodayByUserId(user.getId()).stream()
                .map(Task::getTitle)
                .toList();

        if (!notCompleted.isEmpty() || !completedToday.isEmpty()) {
            scheduleProducer.send(new ScheduleEvent(
                    user.getEmail(),
                    EMAIL_TITLE,
                    getEmailText(notCompleted, completedToday)
            ));
        }
    }

    private String getEmailText(List<String> notCompleted, List<String> completedToday) {
        if (!notCompleted.isEmpty() && !completedToday.isEmpty()) {
            return "Completed today:<br>" + completedToday + "<br>Waiting to complete:<br>" + notCompleted;
        } else if (!notCompleted.isEmpty()) {
            return "Waiting to complete:<br>" + notCompleted;
        }
        else{
            return "Completed today:<br>" + completedToday;

        }
    }
}