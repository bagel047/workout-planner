package mk.ukim.finki.workoutplanner.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.service.AiPlanService;
import mk.ukim.finki.workoutplanner.web.request.AiGenerateRequest;
import mk.ukim.finki.workoutplanner.web.response.WorkoutPlanResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiPlanController {

    private final AiPlanService aiPlanService;

    @PostMapping("/generate")
    public ResponseEntity<WorkoutPlanResponse> generate(
            @Valid @RequestBody AiGenerateRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(aiPlanService.generate(request)));
    }
}
