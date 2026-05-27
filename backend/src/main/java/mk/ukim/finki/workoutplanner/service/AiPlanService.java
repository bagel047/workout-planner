package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.web.request.AiGenerateRequest;

public interface AiPlanService {
    WorkoutPlan generate(AiGenerateRequest request);
}