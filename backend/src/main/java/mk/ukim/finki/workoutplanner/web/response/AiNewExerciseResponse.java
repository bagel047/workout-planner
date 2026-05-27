package mk.ukim.finki.workoutplanner.web.response;

public record AiNewExerciseResponse(
        String name,
        String description,
        String muscleGroup,
        String equipmentType,
        String difficultyLevel
) {}