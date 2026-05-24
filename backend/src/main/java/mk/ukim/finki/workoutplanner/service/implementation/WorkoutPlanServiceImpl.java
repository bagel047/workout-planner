package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.exception.ExerciseNotFoundException;
import mk.ukim.finki.workoutplanner.exception.UnauthorizedAccessException;
import mk.ukim.finki.workoutplanner.exception.WorkoutDayNotFoundException;
import mk.ukim.finki.workoutplanner.exception.WorkoutPlanNotFoundException;
import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutDay;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutExercise;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.repository.WorkoutDayRepository;
import mk.ukim.finki.workoutplanner.repository.WorkoutExerciseRepository;
import mk.ukim.finki.workoutplanner.repository.WorkoutPlanRepository;
import mk.ukim.finki.workoutplanner.service.ExerciseService;
import mk.ukim.finki.workoutplanner.service.WorkoutPlanService;
import mk.ukim.finki.workoutplanner.util.SecurityUtil;
import mk.ukim.finki.workoutplanner.web.request.WorkoutDayRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutExerciseRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutPlanRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static mk.ukim.finki.workoutplanner.service.FieldFilterSpecification.*;

@Service
@RequiredArgsConstructor
public class WorkoutPlanServiceImpl implements WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final ExerciseService exerciseService;

    // --- Plans --------------------------------------------------

    @Override
    public Page<WorkoutPlan> findAccessible(String name, String description, Integer daysPerWeek,
                                            FitnessGoal goal, Level experienceLevel,
                                            ContentSource source, Boolean isAiGenerated,
                                            Integer pageNum, Integer pageSize) {
        User currentUser = SecurityUtil.getCurrentUser();

        Specification<WorkoutPlan> accessFilter = Specification.anyOf(
                filterEqualsV(WorkoutPlan.class, "source", ContentSource.SYSTEM),
                filterEquals(WorkoutPlan.class, "user.id", currentUser.getId())
        );

        List<Specification<WorkoutPlan>> filters = new ArrayList<>();
        filters.add(accessFilter);

        if (name != null && !name.isEmpty())
            filters.add(filterContainsText(WorkoutPlan.class, "name", name));
        if(description != null && !description.isEmpty())
            filters.add(filterContainsText(WorkoutPlan.class, "description", description));
        if(daysPerWeek != null)
            filters.add(filterEquals(WorkoutPlan.class, "daysPerWeek", daysPerWeek));
        if (goal != null)
            filters.add(filterEqualsV(WorkoutPlan.class, "goal", goal));
        if (experienceLevel != null)
            filters.add(filterEqualsV(WorkoutPlan.class, "experienceLevel", experienceLevel));
        if (source != null)
            filters.add(filterEqualsV(WorkoutPlan.class, "source", source));
        if(isAiGenerated != null)
            filters.add(filterEquals(WorkoutPlan.class, "isAiGenerated", isAiGenerated));

        return workoutPlanRepository.findAll(
                Specification.allOf(filters),
                PageRequest.of(pageNum, pageSize, Sort.by(Sort.Direction.ASC, "name")));
    }

    @Override
    public WorkoutPlan findById(Long id) {
        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(id));

        if (plan.getSource() == ContentSource.SYSTEM) {
            return plan;
        }

        User currentUser = SecurityUtil.getCurrentUser();
        if (!plan.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException();
        }

        return plan;
    }

    @Override
    @Transactional
    public WorkoutPlan create(WorkoutPlanRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();

        WorkoutPlan plan = WorkoutPlan.builder()
                .name(request.name())
                .description(request.description())
                .goal(request.goal())
                .experienceLevel(request.experienceLevel())
                .source(ContentSource.USER)
                .isAiGenerated(false)
                .user(currentUser)
                .workoutDays(new ArrayList<>())
                .build();

        if (request.days() != null) {
            if (request.days().size() > 7) {
                throw new IllegalArgumentException("A workout plan cannot have more than 7 days.");
            }

            List<WorkoutDay> days = request.days().stream()
                    .map(d -> buildWorkoutDay(d, plan))
                    .toList();
            plan.getWorkoutDays().addAll(days);
            reorderDays(plan);
        }

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public WorkoutPlan update(Long id, WorkoutPlanRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(id));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        plan.setName(request.name());
        plan.setDescription(request.description());
        plan.setGoal(request.goal());
        plan.setExperienceLevel(request.experienceLevel());

        if (request.days() != null) {

            if (request.days().size() > 7 || plan.getWorkoutDays().size() >= 7) {
                throw new IllegalArgumentException("A workout plan cannot have more than 7 days.");
            }

            plan.getWorkoutDays().clear();
            List<WorkoutDay> days = request.days().stream()
                    .map(d -> buildWorkoutDay(d, plan))
                    .toList();
            plan.getWorkoutDays().addAll(days);
            reorderDays(plan);
        }

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(id));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);
        workoutPlanRepository.delete(plan);
    }

    // --- Days --------------------------------------------------

    @Override
    @Transactional
    public WorkoutPlan addDay(Long planId, WorkoutDayRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        if (plan.getWorkoutDays().size() >= 7) {
            throw new IllegalArgumentException("A workout plan cannot have more than 7 days.");
        }

        WorkoutDay day = buildWorkoutDay(request, plan);
        plan.getWorkoutDays().add(day);
        reorderDays(plan);

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public WorkoutPlan updateDay(Long planId, Long dayId, WorkoutDayRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        WorkoutDay day = findDay(plan, dayId);
        day.setDayNumber(request.dayNumber());
        day.setName(request.name());

        if (request.exercises() != null) {
            day.getWorkoutExercises().clear();
            List<WorkoutExercise> exercises = request.exercises().stream()
                    .map(ex -> buildWorkoutExercise(ex, day))
                    .toList();
            day.getWorkoutExercises().addAll(exercises);
            reorderExercises(day);
        }

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public WorkoutPlan removeDay(Long planId, Long dayId) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        WorkoutDay day = findDay(plan, dayId);
        plan.getWorkoutDays().remove(day);
        reorderDays(plan);

        return workoutPlanRepository.save(plan);
    }

    // --- Exercises --------------------------------------------------

    @Override
    @Transactional
    public WorkoutPlan addExercise(Long planId, Long dayId, WorkoutExerciseRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        WorkoutDay day = findDay(plan, dayId);
        WorkoutExercise exercise = buildWorkoutExercise(request, day);
        day.getWorkoutExercises().add(exercise);
        reorderExercises(day);

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public WorkoutPlan updateExercise(Long planId, Long dayId, Long exerciseId,
                                      WorkoutExerciseRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        WorkoutDay day = findDay(plan, dayId);
        WorkoutExercise entry = findExerciseEntry(day, exerciseId);

        Exercise exercise = exerciseService.findById(request.exerciseId());

        entry.setExercise(exercise);
        entry.setSets(request.sets());
        entry.setReps(request.reps());
        entry.setWeightKg(request.weightKg());
        entry.setRestSeconds(request.restSeconds());
        entry.setOrderIndex(request.orderIndex());
        entry.setNotes(request.notes());

        reorderExercises(day);

        return workoutPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public WorkoutPlan removeExercise(Long planId, Long dayId, Long exerciseId) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkoutPlanNotFoundException(planId));
        User currentUser = SecurityUtil.getCurrentUser();
        checkOwnership(plan, currentUser);

        WorkoutDay day = findDay(plan, dayId);
        WorkoutExercise entry = findExerciseEntry(day, exerciseId);
        day.getWorkoutExercises().remove(entry);
        reorderExercises(day);

        return workoutPlanRepository.save(plan);
    }

    // --- Helpers --------------------------------------------------

    private void checkOwnership(WorkoutPlan plan, User user) {
        if (plan.getSource() == ContentSource.SYSTEM) {
            throw new UnauthorizedAccessException();
        }
        if (!plan.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException();
        }
    }

    private WorkoutDay findDay(WorkoutPlan plan, Long dayId) {
        return plan.getWorkoutDays().stream()
                .filter(d -> d.getId().equals(dayId))
                .findFirst()
                .orElseThrow(() -> new WorkoutDayNotFoundException(dayId));
    }

    private WorkoutExercise findExerciseEntry(WorkoutDay day, Long exerciseId) {
        return day.getWorkoutExercises().stream()
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ExerciseNotFoundException(exerciseId));
    }

    private WorkoutExercise buildWorkoutExercise(WorkoutExerciseRequest request, WorkoutDay day) {
        Exercise exercise = exerciseService.findById(request.exerciseId());

        return WorkoutExercise.builder()
                .exercise(exercise)
                .workoutDay(day)
                .sets(request.sets())
                .reps(request.reps())
                .weightKg(request.weightKg())
                .restSeconds(request.restSeconds())
                .orderIndex(request.orderIndex())
                .notes(request.notes())
                .build();
    }

    private WorkoutDay buildWorkoutDay(WorkoutDayRequest request, WorkoutPlan plan) {
        WorkoutDay day = WorkoutDay.builder()
                .dayNumber(request.dayNumber())
                .name(request.name())
                .workoutPlan(plan)
                .workoutExercises(new ArrayList<>())
                .build();

        if (request.exercises() != null) {
            List<WorkoutExercise> exercises = request.exercises().stream()
                    .map(ex -> buildWorkoutExercise(ex, day))
                    .toList();
            day.getWorkoutExercises().addAll(exercises);
            reorderExercises(day);
        }

        return day;
    }

    private void reorderDays(WorkoutPlan plan) {
        List<WorkoutDay> days = plan.getWorkoutDays();
        for (int i = 0; i < days.size(); i++) {
            days.get(i).setDayNumber(i + 1);
        }
        plan.setDaysPerWeek(days.size());
    }

    private void reorderExercises(WorkoutDay day) {
        List<WorkoutExercise> exercises = day.getWorkoutExercises();
        for (int i = 0; i < exercises.size(); i++) {
            exercises.get(i).setOrderIndex(i + 1);
        }
    }
}