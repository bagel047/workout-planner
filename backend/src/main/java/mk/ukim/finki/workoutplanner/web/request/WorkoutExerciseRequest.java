package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WorkoutExerciseRequest(

        @NotNull(message = "Exercise ID is required")
        Long exerciseId,

        @NotNull(message = "Sets is required")
        @Positive(message = "Sets must be positive")
        Integer sets,

        @NotNull(message = "Reps is required")
        @Positive(message = "Reps must be positive")
        Integer reps,

        Double weightKg,
        Integer restSeconds,
        Integer orderIndex,
        String notes
) {}