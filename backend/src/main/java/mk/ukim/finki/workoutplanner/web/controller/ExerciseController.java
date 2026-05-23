package mk.ukim.finki.workoutplanner.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;
import mk.ukim.finki.workoutplanner.service.ExerciseService;
import mk.ukim.finki.workoutplanner.web.request.ExerciseRequest;
import mk.ukim.finki.workoutplanner.web.response.ExerciseResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<Page<ExerciseResponse>> findAccessible(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MuscleGroup muscleGroup,
            @RequestParam(required = false) EquipmentType equipmentType,
            @RequestParam(required = false) Level difficultyLevel,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<ExerciseResponse> page = exerciseService
                .findAccessible(name, description, muscleGroup, equipmentType, difficultyLevel, pageNum, pageSize)
                .map(ExerciseResponse::from);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ExerciseResponse.from(exerciseService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> create(@Valid @RequestBody ExerciseRequest request) {
        ExerciseResponse response = ExerciseResponse.from(exerciseService.create(request));
        return ResponseEntity.created(URI.create("/api/exercises/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(ExerciseResponse.from(exerciseService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        exerciseService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Exercise deleted successfully"));
    }
}
