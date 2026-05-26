package mk.ukim.finki.workoutplanner.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;
import mk.ukim.finki.workoutplanner.service.TrainingSessionService;
import mk.ukim.finki.workoutplanner.service.WorkoutPlanService;
import mk.ukim.finki.workoutplanner.web.request.SessionSetRequest;
import mk.ukim.finki.workoutplanner.web.request.TrainingSessionRequest;
import mk.ukim.finki.workoutplanner.web.response.SessionsByDayResponse;
import mk.ukim.finki.workoutplanner.web.response.TrainingSessionResponse;
import mk.ukim.finki.workoutplanner.web.response.WorkoutDayResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class TrainingSessionController {

    private final TrainingSessionService trainingSessionService;
    private final WorkoutPlanService workoutPlanService;

    // --- TrainingSessions ------------------------------------------------

    @GetMapping
    public ResponseEntity<Page<TrainingSessionResponse>> findMyHistory(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<TrainingSessionResponse> page = trainingSessionService
                .findMyHistory(from, to, pageNum, pageSize)
                .map(TrainingSessionResponse::from);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/by-day/{workoutDayId}")
    public ResponseEntity<SessionsByDayResponse> findByWorkoutDay(@PathVariable Long workoutDayId) {
        List<TrainingSession> sessions = trainingSessionService.findByWorkoutDay(workoutDayId);

        WorkoutDayResponse workoutDay = sessions.isEmpty()
                ? WorkoutDayResponse.from(workoutPlanService.findDayById(workoutDayId))
                : WorkoutDayResponse.from(sessions.getFirst().getWorkoutDay());

        return ResponseEntity.ok(SessionsByDayResponse.from(workoutDay, sessions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingSessionResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(TrainingSessionResponse.from(trainingSessionService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<TrainingSessionResponse> create(
            @Valid @RequestBody TrainingSessionRequest request) {
        TrainingSessionResponse response = TrainingSessionResponse.from(
                trainingSessionService.create(request));
        return ResponseEntity.created(URI.create("/api/sessions/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingSessionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TrainingSessionRequest request) {
        return ResponseEntity.ok(TrainingSessionResponse.from(
                trainingSessionService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        trainingSessionService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Training session deleted successfully"));
    }

    // --- TrainingSets ------------------------------------------------

    @PostMapping("/{id}/sets")
    public ResponseEntity<TrainingSessionResponse> addSet(
            @PathVariable Long id,
            @Valid @RequestBody SessionSetRequest request) {
        return ResponseEntity.ok(TrainingSessionResponse.from(
                trainingSessionService.addSet(id, request)));
    }

    @PutMapping("/{id}/sets/{setId}")
    public ResponseEntity<TrainingSessionResponse> updateSet(
            @PathVariable Long id,
            @PathVariable Long setId,
            @Valid @RequestBody SessionSetRequest request) {
        return ResponseEntity.ok(TrainingSessionResponse.from(
                trainingSessionService.updateSet(id, setId, request)));
    }

    @DeleteMapping("/{id}/sets/{setId}")
    public ResponseEntity<TrainingSessionResponse> removeSet(
            @PathVariable Long id,
            @PathVariable Long setId) {
        return ResponseEntity.ok(TrainingSessionResponse.from(
                trainingSessionService.removeSet(id, setId)));
    }
}