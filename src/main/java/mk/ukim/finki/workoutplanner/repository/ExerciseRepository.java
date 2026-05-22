package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findBySource(ContentSource source);
    List<Exercise> findBySourceOrCreatedById(ContentSource source, Long userId);  // SYSTEM + own
    List<Exercise> findByNameIgnoreCase(String name);
    List<Exercise> findByMuscleGroup(MuscleGroup muscleGroup);
    List<Exercise> findByDifficultyLevel(Level difficultyLevel);
    List<Exercise> findByEquipmentType(EquipmentType equipmentType);
    List<Exercise> findByCreatedById(Long userId);
}
