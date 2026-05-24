package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutPlanRepository extends JpaSpecificationRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findBySource(ContentSource source);
    List<WorkoutPlan> findByUserId(Long userId);
    List<WorkoutPlan> findBySourceOrUserId(ContentSource source, Long userId); // SYSTEM + own
    List<WorkoutPlan> findByIsAiGeneratedTrue();
}
