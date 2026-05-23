package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findByUserIdOrderByDateDesc(Long userId);
    List<TrainingSession> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to);
    List<TrainingSession> findByUserIdAndWorkoutDayId(Long userId, Long workoutDayId);
}
