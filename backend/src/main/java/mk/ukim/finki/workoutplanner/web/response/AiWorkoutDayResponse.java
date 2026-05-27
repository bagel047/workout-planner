package mk.ukim.finki.workoutplanner.web.response;

import java.util.List;

public record AiWorkoutDayResponse(
        Integer dayNumber,
        String name,
        List<AiWorkoutExerciseResponse> exercises
) {}