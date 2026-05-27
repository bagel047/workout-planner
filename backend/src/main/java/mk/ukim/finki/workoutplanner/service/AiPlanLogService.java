package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.AiPlanRequest;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.web.request.AiGenerateRequest;

public interface AiPlanLogService {

    AiPlanRequest saveRequest(AiGenerateRequest request, String prompt, User user);

    void saveResponse(AiPlanRequest request, String rawResponse,
                      boolean parsedSuccessfully, String parseError,
                      WorkoutPlan generatedPlan);

    void saveResponseInCurrentTransaction(AiPlanRequest request, String rawResponse,
                                          boolean parsedSuccessfully, String parseError,
                                          WorkoutPlan generatedPlan);
}
