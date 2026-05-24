package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;

import java.time.LocalDateTime;
import java.util.List;

public record WorkoutPlanResponse(
        Long id,
        String name,
        String description,
        FitnessGoal goal,
        Integer daysPerWeek,
        Level experienceLevel,
        ContentSource source,
        Boolean isAiGenerated,
        LocalDateTime createdAt,
        Long createdByUserId,
        List<WorkoutDayResponse> days
) {
    public static WorkoutPlanResponse from(WorkoutPlan plan) {
        return new WorkoutPlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getDescription(),
                plan.getGoal(),
                plan.getDaysPerWeek(),
                plan.getExperienceLevel(),
                plan.getSource(),
                plan.getIsAiGenerated(),
                plan.getCreatedAt(),
                plan.getUser() != null ? plan.getUser().getId() : null,
                plan.getWorkoutDays().stream()
                        .map(WorkoutDayResponse::from)
                        .toList()
        );
    }
}