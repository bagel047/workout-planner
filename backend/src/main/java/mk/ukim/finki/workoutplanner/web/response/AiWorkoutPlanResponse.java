package mk.ukim.finki.workoutplanner.web.response;

import java.util.List;

public record AiWorkoutPlanResponse(
        String name,
        String description,
        String goal,
        String experienceLevel,
        List<AiWorkoutDayResponse> days
) {}