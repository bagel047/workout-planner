package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TrainingSessionResponse(
        Long id,
        LocalDate date,
        Integer durationMinutes,
        String notes,
        LocalDateTime createdAt,
        Long userId,
        WorkoutDayResponse workoutDay,          // null for free sessions
        List<SessionSetResponse> sets
) {
    public static TrainingSessionResponse from(TrainingSession session) {
        return new TrainingSessionResponse(
                session.getId(),
                session.getDate(),
                session.getDurationMinutes(),
                session.getNotes(),
                session.getCreatedAt(),
                session.getUser().getId(),
                session.getWorkoutDay() != null
                        ? WorkoutDayResponse.from(session.getWorkoutDay())
                        : null,
                session.getSessionSets().stream()
                        .map(SessionSetResponse::from)
                        .toList()
        );
    }
}