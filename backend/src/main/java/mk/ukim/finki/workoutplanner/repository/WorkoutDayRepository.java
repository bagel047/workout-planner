package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, Long> {
    List<WorkoutDay> findByWorkoutPlanIdOrderByDayNumberAsc(Long workoutPlanId);
    void deleteByWorkoutPlanId(Long workoutPlanId);
}
