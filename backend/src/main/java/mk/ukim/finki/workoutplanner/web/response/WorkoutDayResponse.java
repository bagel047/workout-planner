package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutDay;

import java.util.List;

public record WorkoutDayResponse(
        Long id,
        Integer dayNumber,
        String name,
        List<WorkoutExerciseResponse> exercises
) {
    public static WorkoutDayResponse from(WorkoutDay workoutDay) {
        return new WorkoutDayResponse(
                workoutDay.getId(),
                workoutDay.getDayNumber(),
                workoutDay.getName(),
                workoutDay.getWorkoutExercises().stream()
                        .map(WorkoutExerciseResponse::from)
                        .toList()
        );
    }
}