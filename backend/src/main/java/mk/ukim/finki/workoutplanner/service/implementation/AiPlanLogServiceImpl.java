package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.AiPlanRequest;
import mk.ukim.finki.workoutplanner.model.entity.AiPlanResponse;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.repository.AiPlanRequestRepository;
import mk.ukim.finki.workoutplanner.repository.AiPlanResponseRepository;
import mk.ukim.finki.workoutplanner.service.AiPlanLogService;
import mk.ukim.finki.workoutplanner.web.request.AiGenerateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

@Service
@RequiredArgsConstructor
public class AiPlanLogServiceImpl implements AiPlanLogService {

    private final AiPlanResponseRepository aiPlanResponseRepository;
    private final AiPlanRequestRepository aiPlanRequestRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AiPlanRequest saveRequest(AiGenerateRequest request, String prompt, User user) {
        AiPlanRequest aiPlanRequest = AiPlanRequest.builder()
                .goal(request.goal())
                .experienceLevel(request.experienceLevel())
                .daysPerWeek(request.daysPerWeek())
                .availableEquipment(request.availableEquipment())
                .additionalNotes(request.additionalNotes())
                .rawPrompt(prompt)
                .user(user)
                .build();
        return aiPlanRequestRepository.save(aiPlanRequest);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveResponse(AiPlanRequest request, String rawResponse,
                             boolean parsedSuccessfully, String parseError,
                             WorkoutPlan generatedPlan) {
        AiPlanResponse aiPlanResponse = AiPlanResponse.builder()
                .request(request)
                .rawResponse(rawResponse)
                .parsedSuccessfully(parsedSuccessfully)
                .parseErrorMessage(parseError)
                .generatedPlan(generatedPlan)
                .build();
        aiPlanResponseRepository.save(aiPlanResponse);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void saveResponseInCurrentTransaction(AiPlanRequest request, String rawResponse,
                                                 boolean parsedSuccessfully, String parseError,
                                                 WorkoutPlan generatedPlan) {
        AiPlanResponse aiPlanResponse = AiPlanResponse.builder()
                .request(request)
                .rawResponse(rawResponse)
                .parsedSuccessfully(parsedSuccessfully)
                .parseErrorMessage(parseError)
                .generatedPlan(generatedPlan)
                .build();
        aiPlanResponseRepository.save(aiPlanResponse);
    }
}
