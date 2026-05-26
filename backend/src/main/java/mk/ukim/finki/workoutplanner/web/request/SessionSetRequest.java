package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SessionSetRequest(

        Long exerciseId,
        Long workoutExerciseId,   // nullable: null for free session sets

        @NotNull(message = "Reps completed is required")
        @Positive(message = "Reps must be positive")
        Integer repsCompleted,

        Double weightKg,          // nullable: bodyweight exercises

        @Min(value = 1, message = "RPE must be at least 1")
        @Max(value = 10, message = "RPE cannot exceed 10")
        Integer rpe
) {
}