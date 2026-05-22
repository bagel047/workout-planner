package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.SessionSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionSetRepository extends JpaRepository<SessionSet, Long> {
    List<SessionSet> findByTrainingSessionId(Long trainingSessionId);
    List<SessionSet> findByWorkoutExerciseId(Long workoutExerciseId);
}
