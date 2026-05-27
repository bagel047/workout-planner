package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;

import java.util.List;

public record AiGenerateRequest(

        @NotNull(message = "Goal is required")
        FitnessGoal goal,

        @NotNull(message = "Experience level is required")
        Level experienceLevel,

        @NotNull(message = "Days per week is required")
        @Min(value = 1, message = "Must train at least 1 day per week")
        @Max(value = 7, message = "Cannot train more than 7 days per week")
        Integer daysPerWeek,

        @NotNull(message = "Available equipment is required")
        List<EquipmentType> availableEquipment,

        String additionalNotes
) {}