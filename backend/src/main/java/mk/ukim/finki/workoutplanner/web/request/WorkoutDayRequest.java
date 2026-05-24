package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record WorkoutDayRequest(

        Integer dayNumber,

        @NotBlank(message = "Day name is required")
        String name,

        List<WorkoutExerciseRequest> exercises
) {}