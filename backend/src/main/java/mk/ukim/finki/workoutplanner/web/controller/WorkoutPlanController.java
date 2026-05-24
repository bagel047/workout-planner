package mk.ukim.finki.workoutplanner.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.service.WorkoutPlanService;
import mk.ukim.finki.workoutplanner.web.request.WorkoutDayRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutExerciseRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutPlanRequest;
import mk.ukim.finki.workoutplanner.web.response.WorkoutPlanResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    // --- Plan endpoints --------------------------------------------------

    @GetMapping
    public ResponseEntity<Page<WorkoutPlanResponse>> findAccessible(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer daysPerWeek,
            @RequestParam(required = false) FitnessGoal goal,
            @RequestParam(required = false) Level experienceLevel,
            @RequestParam(required = false) ContentSource source,
            @RequestParam(required = false) Boolean isAiGenerated,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<WorkoutPlanResponse> page = workoutPlanService
                .findAccessible(name, description, daysPerWeek, goal,
                        experienceLevel, source, isAiGenerated,
                        pageNum, pageSize)
                .map(WorkoutPlanResponse::from);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlanResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(workoutPlanService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<WorkoutPlanResponse> create(@Valid @RequestBody WorkoutPlanRequest request) {
        WorkoutPlanResponse response = WorkoutPlanResponse.from(workoutPlanService.create(request));
        return ResponseEntity.created(URI.create("/api/plans/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlanResponse> update(@PathVariable Long id,
                                                      @Valid @RequestBody WorkoutPlanRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(workoutPlanService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        workoutPlanService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Workout plan deleted successfully"));
    }

    // --- Day endpoints --------------------------------------------------

    @PostMapping("/{id}/days")
    public ResponseEntity<WorkoutPlanResponse> addDay(@PathVariable Long id,
                                                      @Valid @RequestBody WorkoutDayRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(workoutPlanService.addDay(id, request)));
    }

    @PutMapping("/{id}/days/{dayId}")
    public ResponseEntity<WorkoutPlanResponse> updateDay(@PathVariable Long id,
                                                         @PathVariable Long dayId,
                                                         @Valid @RequestBody WorkoutDayRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(workoutPlanService.updateDay(id, dayId, request)));
    }

    @DeleteMapping("/{id}/days/{dayId}")
    public ResponseEntity<WorkoutPlanResponse> removeDay(@PathVariable Long id,
                                                         @PathVariable Long dayId) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(workoutPlanService.removeDay(id, dayId)));
    }

    // --- Exercise endpoints --------------------------------------------------

    @PostMapping("/{id}/days/{dayId}/exercises")
    public ResponseEntity<WorkoutPlanResponse> addExercise(@PathVariable Long id,
                                                           @PathVariable Long dayId,
                                                           @Valid @RequestBody WorkoutExerciseRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(
                workoutPlanService.addExercise(id, dayId, request)));
    }

    @PutMapping("/{id}/days/{dayId}/exercises/{exerciseId}")
    public ResponseEntity<WorkoutPlanResponse> updateExercise(@PathVariable Long id,
                                                              @PathVariable Long dayId,
                                                              @PathVariable Long exerciseId,
                                                              @Valid @RequestBody WorkoutExerciseRequest request) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(
                workoutPlanService.updateExercise(id, dayId, exerciseId, request)));
    }

    @DeleteMapping("/{id}/days/{dayId}/exercises/{exerciseId}")
    public ResponseEntity<WorkoutPlanResponse> removeExercise(@PathVariable Long id,
                                                              @PathVariable Long dayId,
                                                              @PathVariable Long exerciseId) {
        return ResponseEntity.ok(WorkoutPlanResponse.from(
                workoutPlanService.removeExercise(id, dayId, exerciseId)));
    }
}