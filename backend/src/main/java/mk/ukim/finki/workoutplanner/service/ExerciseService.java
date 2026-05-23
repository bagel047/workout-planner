package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;
import mk.ukim.finki.workoutplanner.web.request.ExerciseRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ExerciseService {

    Page<Exercise> findAccessible(String name, String description,
                                  MuscleGroup muscleGroup, EquipmentType equipmentType, Level difficultyLevel,
                                  Integer pageNum, Integer pageSize);

    Exercise findById(Long id);

    Exercise create(ExerciseRequest request);

    Exercise update(Long id, ExerciseRequest request);

    void delete(Long id);
}
