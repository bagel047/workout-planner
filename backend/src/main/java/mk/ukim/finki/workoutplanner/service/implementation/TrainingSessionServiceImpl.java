package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.exception.SessionSetNotFoundException;
import mk.ukim.finki.workoutplanner.exception.TrainingSessionNotFoundException;
import mk.ukim.finki.workoutplanner.exception.UnauthorizedAccessException;
import mk.ukim.finki.workoutplanner.model.entity.*;
import mk.ukim.finki.workoutplanner.repository.SessionSetRepository;
import mk.ukim.finki.workoutplanner.repository.TrainingSessionRepository;
import mk.ukim.finki.workoutplanner.service.ExerciseService;
import mk.ukim.finki.workoutplanner.service.TrainingSessionService;
import mk.ukim.finki.workoutplanner.service.WorkoutPlanService;
import mk.ukim.finki.workoutplanner.util.SecurityUtil;
import mk.ukim.finki.workoutplanner.web.request.SessionSetRequest;
import mk.ukim.finki.workoutplanner.web.request.TrainingSessionRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final WorkoutPlanService workoutPlanService;
    private final ExerciseService exerciseService;


    // --- TrainingSessions ------------------------------------------------

    @Override
    public Page<TrainingSession> findMyHistory(LocalDate from, LocalDate to,
                                               Integer pageNum, Integer pageSize) {
        User currentUser = SecurityUtil.getCurrentUser();

        if (from != null && to != null) {
            return trainingSessionRepository.findByUserIdAndDateBetweenOrderByDateDesc(
                    currentUser.getId(), from, to,
                    PageRequest.of(pageNum, pageSize));
        }

        return trainingSessionRepository.findByUserIdOrderByDateDesc(
                currentUser.getId(),
                PageRequest.of(pageNum, pageSize, Sort.by(Sort.Direction.DESC, "date")));
    }

    @Override
    public List<TrainingSession> findByWorkoutDay(Long workoutDayId) {
        User currentUser = SecurityUtil.getCurrentUser();
        return trainingSessionRepository.findByUserIdAndWorkoutDayId(
                currentUser.getId(), workoutDayId);
    }

    @Override
    public TrainingSession findById(Long id) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new TrainingSessionNotFoundException(id));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);
        return session;
    }

    @Override
    @Transactional
    public TrainingSession create(TrainingSessionRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();

        WorkoutDay workoutDay = null;
        if (request.workoutDayId() != null) {
            workoutDay = workoutPlanService.findDayById(request.workoutDayId());
        }

        TrainingSession session = TrainingSession.builder()
                .user(currentUser)
                .date(request.date())
                .durationMinutes(request.durationMinutes())
                .notes(request.notes())
                .workoutDay(workoutDay)
                .sessionSets(new ArrayList<>())
                .build();

        if (request.sets() != null) {
            List<SessionSet> sets = request.sets().stream()
                    .map(s -> buildSet(s, session))
                    .toList();
            session.getSessionSets().addAll(sets);
        }

        return trainingSessionRepository.save(session);
    }

    @Override
    @Transactional
    public TrainingSession update(Long id, TrainingSessionRequest request) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new TrainingSessionNotFoundException(id));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);

        session.setDate(request.date());
        session.setDurationMinutes(request.durationMinutes());
        session.setNotes(request.notes());

        if (request.workoutDayId() != null) {
            WorkoutDay workoutDay = workoutPlanService.findDayById(request.workoutDayId());
            session.setWorkoutDay(workoutDay);
        }

        if (request.sets() != null) {
            session.getSessionSets().clear();
            List<SessionSet> sets = request.sets().stream()
                    .map(s -> buildSet(s, session))
                    .toList();
            session.getSessionSets().addAll(sets);
        }

        return trainingSessionRepository.save(session);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new TrainingSessionNotFoundException(id));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);
        trainingSessionRepository.delete(session);
    }


    // --- TrainingSets ------------------------------------------------

    @Override
    @Transactional
    public TrainingSession addSet(Long sessionId, SessionSetRequest request) {
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new TrainingSessionNotFoundException(sessionId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);

        SessionSet set = buildSet(request, session);
        session.getSessionSets().add(set);

        return trainingSessionRepository.save(session);
    }

    @Override
    @Transactional
    public TrainingSession updateSet(Long sessionId, Long setId, SessionSetRequest request) {
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new TrainingSessionNotFoundException(sessionId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);

        SessionSet set = findSet(session, setId);

        WorkoutExercise workoutExercise = null;
        if (request.workoutExerciseId() != null) {
            workoutExercise = workoutPlanService.findWorkoutExerciseById(request.workoutExerciseId());
        }

        set.setRepsCompleted(request.repsCompleted());
        set.setWeightKg(request.weightKg());
        set.setRpe(request.rpe());
        set.setWorkoutExercise(workoutExercise);

        return trainingSessionRepository.save(session);
    }

    @Override
    @Transactional
    public TrainingSession removeSet(Long sessionId, Long setId) {
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new TrainingSessionNotFoundException(sessionId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(session, currentUser);

        SessionSet set = findSet(session, setId);
        session.getSessionSets().remove(set);

        return trainingSessionRepository.save(session);
    }


    // --- Helpers ------------------------------------------------

    private void checkOwnership(TrainingSession session, User user) {
        if (!session.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException();
        }
    }

    private SessionSet findSet(TrainingSession session, Long setId) {
        return session.getSessionSets().stream()
                .filter(s -> s.getId().equals(setId))
                .findFirst()
                .orElseThrow(() -> new SessionSetNotFoundException(setId));
    }

    private SessionSet buildSet(SessionSetRequest request, TrainingSession session) {

        WorkoutExercise workoutExercise = null;
        if (request.workoutExerciseId() != null) {
            workoutExercise = workoutPlanService.findWorkoutExerciseById(request.workoutExerciseId());
        }

        if (workoutExercise == null && request.exerciseId() == null) {
            throw new IllegalArgumentException("Exercise is required for free session sets");
        }

        Exercise exercise = workoutExercise != null
                ? workoutExercise.getExercise()
                : exerciseService.findById(request.exerciseId());

        return SessionSet.builder()
                .trainingSession(session)
                .exercise(exercise)
                .workoutExercise(workoutExercise)
                .repsCompleted(request.repsCompleted())
                .weightKg(request.weightKg())
                .rpe(request.rpe())
                .build();
    }
}