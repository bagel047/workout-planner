package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.WorkoutDay;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutExercise;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.web.request.WorkoutDayRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutExerciseRequest;
import mk.ukim.finki.workoutplanner.web.request.WorkoutPlanRequest;
import org.springframework.data.domain.Page;

public interface WorkoutPlanService {

    Page<WorkoutPlan> findAccessible(String name, String description, Integer daysPerWeek,
                                     FitnessGoal goal, Level experienceLevel,
                                     ContentSource source, Boolean isAiGenerated,
                                     Integer pageNum, Integer pageSize);

    WorkoutPlan findById(Long id);

    WorkoutPlan create(WorkoutPlanRequest request);

    WorkoutPlan update(Long id, WorkoutPlanRequest request);

    void delete(Long id);


    WorkoutDay findDayById(Long dayId);

    WorkoutPlan addDay(Long planId, WorkoutDayRequest request);

    WorkoutPlan updateDay(Long planId, Long dayId, WorkoutDayRequest request);

    WorkoutPlan removeDay(Long planId, Long dayId);


    WorkoutExercise findWorkoutExerciseById(Long exerciseId);

    WorkoutPlan addExercise(Long planId, Long dayId, WorkoutExerciseRequest request);

    WorkoutPlan updateExercise(Long planId, Long dayId, Long exerciseId, WorkoutExerciseRequest request);

    WorkoutPlan removeExercise(Long planId, Long dayId, Long exerciseId);
}