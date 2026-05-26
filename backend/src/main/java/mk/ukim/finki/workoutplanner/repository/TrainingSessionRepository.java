package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TrainingSessionRepository extends JpaSpecificationRepository<TrainingSession, Long> {
    List<TrainingSession> findByUserIdOrderByDateDesc(Long userId);
    List<TrainingSession> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to);
    List<TrainingSession> findByUserIdAndWorkoutDayId(Long userId, Long workoutDayId);
    Page<TrainingSession> findByUserIdOrderByDateDesc(Long userId, Pageable pageable);
    Page<TrainingSession> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to, Pageable pageable);
}
