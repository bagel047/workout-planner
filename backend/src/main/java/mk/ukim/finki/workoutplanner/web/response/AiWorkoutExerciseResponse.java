package mk.ukim.finki.workoutplanner.web.response;

public record AiWorkoutExerciseResponse(
        Long existingExerciseId,
        Integer sets,
        Integer reps,
        Double weightKg,
        Integer restSeconds,
        Integer orderIndex,
        String notes,
        AiNewExerciseResponse newExercise
) {}