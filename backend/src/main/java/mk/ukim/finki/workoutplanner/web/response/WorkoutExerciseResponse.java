package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutExercise;

public record WorkoutExerciseResponse(
        Long id,
        Integer sets,
        Integer reps,
        Double weightKg,
        Integer restSeconds,
        Integer orderIndex,
        String notes,
        ExerciseResponse exercise
) {
    public static WorkoutExerciseResponse from(WorkoutExercise workoutExercise) {
        return new WorkoutExerciseResponse(
                workoutExercise.getId(),
                workoutExercise.getSets(),
                workoutExercise.getReps(),
                workoutExercise.getWeightKg(),
                workoutExercise.getRestSeconds(),
                workoutExercise.getOrderIndex(),
                workoutExercise.getNotes(),
                ExerciseResponse.from(workoutExercise.getExercise())
        );
    }
}