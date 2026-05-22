package mk.ukim.finki.workoutplanner.repository;

import mk.ukim.finki.workoutplanner.model.entity.AiPlanResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AiPlanResponseRepository extends JpaRepository<AiPlanResponse, Long> {
    Optional<AiPlanResponse> findByRequestId(Long requestId);
    List<AiPlanResponse> findByParsedSuccessfullyFalse();
}
