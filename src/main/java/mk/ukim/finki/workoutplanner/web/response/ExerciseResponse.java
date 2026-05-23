package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;

public record ExerciseResponse(
        Long id,
        String name,
        String description,
        MuscleGroup muscleGroup,
        EquipmentType equipmentType,
        Level difficultyLevel,
        String videoUrl,
        ContentSource source,
        Long createdById
) {
    public static ExerciseResponse from(Exercise exercise) {
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getDescription(),
                exercise.getMuscleGroup(),
                exercise.getEquipmentType(),
                exercise.getDifficultyLevel(),
                exercise.getVideoUrl(),
                exercise.getSource(),
                exercise.getCreatedBy() != null ? exercise.getCreatedBy().getId() : null
        );
    }
}