package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;

public record ExerciseRequest(
        @NotBlank(message = "Exercise name is required")
        String name,

        String description,

        @NotNull(message = "Muscle group is required")
        MuscleGroup muscleGroup,

        @NotNull(message = "Equipment type is required")
        EquipmentType equipmentType,

        @NotNull(message = "Difficulty level is required")
        Level difficultyLevel,

        String videoUrl
) {
}
