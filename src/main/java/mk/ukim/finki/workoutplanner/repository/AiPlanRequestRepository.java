package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.AiPlanRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiPlanRequestRepository extends JpaRepository<AiPlanRequest, Long> {
    List<AiPlanRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}
