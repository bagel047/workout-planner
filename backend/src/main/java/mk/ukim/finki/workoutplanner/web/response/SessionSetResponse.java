package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.SessionSet;

public record SessionSetResponse(
        Long id,
        Integer repsCompleted,
        Double weightKg,
        Integer rpe,
        ExerciseResponse exercise,
        WorkoutExerciseResponse workoutExercise         // null for free sessions
) {
    public static SessionSetResponse from(SessionSet set) {
        return new SessionSetResponse(
                set.getId(),
                set.getRepsCompleted(),
                set.getWeightKg(),
                set.getRpe(),
                ExerciseResponse.from(set.getExercise()),
                set.getWorkoutExercise() != null
                        ? WorkoutExerciseResponse.from(set.getWorkoutExercise())
                        : null
        );
    }
}