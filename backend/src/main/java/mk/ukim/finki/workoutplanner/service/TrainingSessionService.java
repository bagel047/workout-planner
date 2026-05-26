package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.TrainingSession;
import mk.ukim.finki.workoutplanner.web.request.SessionSetRequest;
import mk.ukim.finki.workoutplanner.web.request.TrainingSessionRequest;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface TrainingSessionService {

    Page<TrainingSession> findMyHistory(LocalDate from, LocalDate to,
                                        Integer pageNum, Integer pageSize);

    List<TrainingSession> findByWorkoutDay(Long workoutDayId);

    TrainingSession findById(Long id);

    TrainingSession create(TrainingSessionRequest request);

    TrainingSession update(Long id, TrainingSessionRequest request);

    void delete(Long id);


    TrainingSession addSet(Long sessionId, SessionSetRequest request);

    TrainingSession updateSet(Long sessionId, Long setId, SessionSetRequest request);

    TrainingSession removeSet(Long sessionId, Long setId);
}