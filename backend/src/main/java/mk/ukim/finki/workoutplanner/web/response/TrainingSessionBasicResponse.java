package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// TrainingSessionResponse without the nested WorkoutDayResponse
public record TrainingSessionBasicResponse(
        Long id,
        LocalDate date,
        Integer durationMinutes,
        String notes,
        LocalDateTime createdAt,
        Long userId,
        List<SessionSetResponse> sets
) {
    public static TrainingSessionBasicResponse from(TrainingSession session) {
        return new TrainingSessionBasicResponse(
                session.getId(),
                session.getDate(),
                session.getDurationMinutes(),
                session.getNotes(),
                session.getCreatedAt(),
                session.getUser().getId(),
                session.getSessionSets().stream()
                        .map(SessionSetResponse::from)
                        .toList()
        );
    }
}