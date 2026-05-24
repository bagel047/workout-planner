package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;

import java.util.List;

public record WorkoutPlanRequest(

        @NotBlank(message = "Plan name is required")
        String name,

        String description,

        @NotNull(message = "Goal is required")
        FitnessGoal goal,

        @NotNull(message = "Experience level is required")
        Level experienceLevel,

        List<WorkoutDayRequest> days
) {}