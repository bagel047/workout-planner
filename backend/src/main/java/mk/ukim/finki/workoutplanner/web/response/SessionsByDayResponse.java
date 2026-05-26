package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;

import java.util.List;

public record SessionsByDayResponse(
        WorkoutDayResponse workoutDay,
        List<TrainingSessionBasicResponse> sessions
) {
    public static SessionsByDayResponse from(WorkoutDayResponse workoutDay,
                                             List<TrainingSession> sessions) {
        return new SessionsByDayResponse(
                workoutDay,
                sessions.stream()
                        .map(TrainingSessionBasicResponse::from)
                        .toList()
        );
    }
}