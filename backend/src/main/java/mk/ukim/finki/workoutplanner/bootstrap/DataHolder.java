package mk.ukim.finki.workoutplanner.bootstrap;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutDay;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutExercise;
import mk.ukim.finki.workoutplanner.model.entity.WorkoutPlan;
import mk.ukim.finki.workoutplanner.model.enums.*;
import mk.ukim.finki.workoutplanner.repository.ExerciseRepository;
import mk.ukim.finki.workoutplanner.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataHolder {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    @PostConstruct
    public void init() {
        if (exerciseRepository.count() == 0) {
            List<Exercise> exercises = List.of(
                    // CHEST
                    Exercise.builder()
                            .name("Barbell Bench Press")
                            .description("Compound chest exercise using a barbell on a flat bench.")
                            .muscleGroup(MuscleGroup.CHEST)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Push Up")
                            .description("Bodyweight chest exercise performed on the floor.")
                            .muscleGroup(MuscleGroup.CHEST)
                            .equipmentType(EquipmentType.BODYWEIGHT)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Incline Dumbbell Press")
                            .description("Chest press on an incline bench targeting upper chest.")
                            .muscleGroup(MuscleGroup.CHEST)
                            .equipmentType(EquipmentType.DUMBBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // BACK
                    Exercise.builder()
                            .name("Deadlift")
                            .description("Compound posterior chain exercise with a barbell.")
                            .muscleGroup(MuscleGroup.BACK)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.ADVANCED)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Pull Up")
                            .description("Bodyweight back exercise hanging from a bar.")
                            .muscleGroup(MuscleGroup.BACK)
                            .equipmentType(EquipmentType.BODYWEIGHT)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Seated Cable Row")
                            .description("Cable machine row targeting the mid back.")
                            .muscleGroup(MuscleGroup.BACK)
                            .equipmentType(EquipmentType.CABLE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // LEGS
                    Exercise.builder()
                            .name("Barbell Squat")
                            .description("Compound leg exercise with barbell on the back.")
                            .muscleGroup(MuscleGroup.LEGS)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Leg Press")
                            .description("Machine-based quad dominant leg exercise.")
                            .muscleGroup(MuscleGroup.LEGS)
                            .equipmentType(EquipmentType.MACHINE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Romanian Deadlift")
                            .description("Hamstring focused hinge movement with dumbbells or barbell.")
                            .muscleGroup(MuscleGroup.LEGS)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // HAMSTRINGS
                    Exercise.builder()
                            .name("Lying Leg Curl")
                            .description("Machine exercise isolating the hamstrings in a lying position.")
                            .muscleGroup(MuscleGroup.HAMSTRINGS)
                            .equipmentType(EquipmentType.MACHINE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Nordic Hamstring Curl")
                            .description("Bodyweight eccentric hamstring exercise performed on the floor.")
                            .muscleGroup(MuscleGroup.HAMSTRINGS)
                            .equipmentType(EquipmentType.BODYWEIGHT)
                            .difficultyLevel(Level.ADVANCED)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // QUADS
                    Exercise.builder()
                            .name("Leg Extension")
                            .description("Machine exercise isolating the quadriceps.")
                            .muscleGroup(MuscleGroup.QUADS)
                            .equipmentType(EquipmentType.MACHINE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Bulgarian Split Squat")
                            .description("Single leg squat with rear foot elevated, quad dominant.")
                            .muscleGroup(MuscleGroup.QUADS)
                            .equipmentType(EquipmentType.DUMBBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // SHOULDERS
                    Exercise.builder()
                            .name("Overhead Press")
                            .description("Barbell press overhead targeting all three shoulder heads.")
                            .muscleGroup(MuscleGroup.SHOULDERS)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Lateral Raise")
                            .description("Dumbbell raise to the side targeting the lateral deltoid.")
                            .muscleGroup(MuscleGroup.SHOULDERS)
                            .equipmentType(EquipmentType.DUMBBELL)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // BICEPS
                    Exercise.builder()
                            .name("Barbell Curl")
                            .description("Classic bicep curl with a barbell.")
                            .muscleGroup(MuscleGroup.BICEPS)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Hammer Curl")
                            .description("Neutral grip dumbbell curl targeting biceps and brachialis.")
                            .muscleGroup(MuscleGroup.BICEPS)
                            .equipmentType(EquipmentType.DUMBBELL)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // TRICEPS
                    Exercise.builder()
                            .name("Tricep Pushdown")
                            .description("Cable pushdown isolating the triceps.")
                            .muscleGroup(MuscleGroup.TRICEPS)
                            .equipmentType(EquipmentType.CABLE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Close Grip Bench Press")
                            .description("Barbell bench press with narrow grip emphasizing triceps.")
                            .muscleGroup(MuscleGroup.TRICEPS)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // CORE
                    Exercise.builder()
                            .name("Plank")
                            .description("Isometric core hold in a push up position.")
                            .muscleGroup(MuscleGroup.CORE)
                            .equipmentType(EquipmentType.BODYWEIGHT)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),
                    Exercise.builder()
                            .name("Cable Crunch")
                            .description("Kneeling cable crunch targeting the rectus abdominis.")
                            .muscleGroup(MuscleGroup.CORE)
                            .equipmentType(EquipmentType.CABLE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // GLUTES
                    Exercise.builder()
                            .name("Hip Thrust")
                            .description("Barbell hip thrust targeting the glutes.")
                            .muscleGroup(MuscleGroup.GLUTES)
                            .equipmentType(EquipmentType.BARBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // CARDIO
                    Exercise.builder()
                            .name("Treadmill Run")
                            .description("Steady state cardio on the treadmill.")
                            .muscleGroup(MuscleGroup.CARDIO)
                            .equipmentType(EquipmentType.MACHINE)
                            .difficultyLevel(Level.BEGINNER)
                            .source(ContentSource.SYSTEM)
                            .build(),

                    // FULL BODY
                    Exercise.builder()
                            .name("Kettlebell Swing")
                            .description("Hip hinge power movement with a kettlebell.")
                            .muscleGroup(MuscleGroup.FULL_BODY)
                            .equipmentType(EquipmentType.KETTLEBELL)
                            .difficultyLevel(Level.INTERMEDIATE)
                            .source(ContentSource.SYSTEM)
                            .build()
            );

            exerciseRepository.saveAll(exercises);
        }

        if(workoutPlanRepository.count() == 0) {

            Exercise benchPress = exerciseRepository.findByNameIgnoreCase("Barbell Bench Press").get(0);
            Exercise inclinePress = exerciseRepository.findByNameIgnoreCase("Incline Dumbbell Press").get(0);
            Exercise pushUp = exerciseRepository.findByNameIgnoreCase("Push Up").get(0);
            Exercise overheadPress = exerciseRepository.findByNameIgnoreCase("Overhead Press").get(0);
            Exercise lateralRaise = exerciseRepository.findByNameIgnoreCase("Lateral Raise").get(0);
            Exercise tricepPushdown = exerciseRepository.findByNameIgnoreCase("Tricep Pushdown").get(0);
            Exercise closeGripBench = exerciseRepository.findByNameIgnoreCase("Close Grip Bench Press").get(0);
            Exercise pullUp = exerciseRepository.findByNameIgnoreCase("Pull Up").get(0);
            Exercise seatedCableRow = exerciseRepository.findByNameIgnoreCase("Seated Cable Row").get(0);
            Exercise deadlift = exerciseRepository.findByNameIgnoreCase("Deadlift").get(0);
            Exercise barbellCurl = exerciseRepository.findByNameIgnoreCase("Barbell Curl").get(0);
            Exercise hammerCurl = exerciseRepository.findByNameIgnoreCase("Hammer Curl").get(0);
            Exercise barbellSquat = exerciseRepository.findByNameIgnoreCase("Barbell Squat").get(0);
            Exercise legPress = exerciseRepository.findByNameIgnoreCase("Leg Press").get(0);
            Exercise legExtension = exerciseRepository.findByNameIgnoreCase("Leg Extension").get(0);
            Exercise romanianDeadlift = exerciseRepository.findByNameIgnoreCase("Romanian Deadlift").get(0);
            Exercise lyingLegCurl = exerciseRepository.findByNameIgnoreCase("Lying Leg Curl").get(0);
            Exercise hipThrust = exerciseRepository.findByNameIgnoreCase("Hip Thrust").get(0);
            Exercise plank = exerciseRepository.findByNameIgnoreCase("Plank").get(0);
            Exercise kettlebellSwing = exerciseRepository.findByNameIgnoreCase("Kettlebell Swing").get(0);

            // --- Push Pull Legs (PPL) ----------------------------------------------

            WorkoutDay pushDay = WorkoutDay.builder()
                    .dayNumber(1)
                    .name("Push: Chest, Shoulders, Triceps")
                    .workoutExercises(new ArrayList<>())
                    .build();
            pushDay.getWorkoutExercises().addAll(List.of(
                    // CHEST
                    WorkoutExercise.builder().exercise(benchPress).workoutDay(pushDay).sets(4).reps(8).weightKg(80.0).restSeconds(90).orderIndex(1).build(),
                    WorkoutExercise.builder().exercise(inclinePress).workoutDay(pushDay).sets(3).reps(10).weightKg(22.5).restSeconds(75).orderIndex(2).build(),
                    WorkoutExercise.builder().exercise(overheadPress).workoutDay(pushDay).sets(3).reps(10).weightKg(50.0).restSeconds(75).orderIndex(3).build(),
                    WorkoutExercise.builder().exercise(lateralRaise).workoutDay(pushDay).sets(3).reps(15).weightKg(10.0).restSeconds(60).orderIndex(4).build(),
                    WorkoutExercise.builder().exercise(tricepPushdown).workoutDay(pushDay).sets(3).reps(12).weightKg(25.0).restSeconds(60).orderIndex(5).build(),
                    WorkoutExercise.builder().exercise(closeGripBench).workoutDay(pushDay).sets(3).reps(10).weightKg(70.0).restSeconds(75).orderIndex(6).build()
            ));

            WorkoutDay pullDay = WorkoutDay.builder()
                    .dayNumber(2)
                    .name("Pull: Back, Biceps")
                    .workoutExercises(new ArrayList<>())
                    .build();
            pullDay.getWorkoutExercises().addAll(List.of(
                    WorkoutExercise.builder().exercise(deadlift).workoutDay(pullDay).sets(4).reps(5).weightKg(120.0).restSeconds(120).orderIndex(1).build(),
                    WorkoutExercise.builder().exercise(pullUp).workoutDay(pullDay).sets(4).reps(8).weightKg(0.0).restSeconds(90).orderIndex(2).build(),
                    WorkoutExercise.builder().exercise(seatedCableRow).workoutDay(pullDay).sets(3).reps(10).weightKg(60.0).restSeconds(75).orderIndex(3).build(),
                    WorkoutExercise.builder().exercise(barbellCurl).workoutDay(pullDay).sets(3).reps(12).weightKg(30.0).restSeconds(60).orderIndex(4).build(),
                    WorkoutExercise.builder().exercise(hammerCurl).workoutDay(pullDay).sets(3).reps(12).weightKg(14.0).restSeconds(60).orderIndex(5).build()
            ));

            WorkoutDay legsDay = WorkoutDay.builder()
                    .dayNumber(3)
                    .name("Legs: Quads, Hamstrings, Glutes")
                    .workoutExercises(new ArrayList<>())
                    .build();
            legsDay.getWorkoutExercises().addAll(List.of(
                    WorkoutExercise.builder().exercise(barbellSquat).workoutDay(legsDay).sets(4).reps(8).weightKg(100.0).restSeconds(120).orderIndex(1).build(),
                    WorkoutExercise.builder().exercise(legPress).workoutDay(legsDay).sets(3).reps(12).weightKg(150.0).restSeconds(90).orderIndex(2).build(),
                    WorkoutExercise.builder().exercise(legExtension).workoutDay(legsDay).sets(3).reps(15).weightKg(50.0).restSeconds(60).orderIndex(3).build(),
                    WorkoutExercise.builder().exercise(romanianDeadlift).workoutDay(legsDay).sets(3).reps(10).weightKg(80.0).restSeconds(90).orderIndex(4).build(),
                    WorkoutExercise.builder().exercise(lyingLegCurl).workoutDay(legsDay).sets(3).reps(12).weightKg(40.0).restSeconds(60).orderIndex(5).build(),
                    WorkoutExercise.builder().exercise(hipThrust).workoutDay(legsDay).sets(3).reps(12).weightKg(90.0).restSeconds(75).orderIndex(6).build()
            ));

            WorkoutPlan ppl = WorkoutPlan.builder()
                    .name("Push Pull Legs (PPL)")
                    .description("Classic 3-day split targeting push, pull and leg movements. Ideal for intermediate lifters.")
                    .goal(FitnessGoal.MUSCLE_GAIN)
                    .experienceLevel(Level.INTERMEDIATE)
                    .source(ContentSource.SYSTEM)
                    .isAiGenerated(false)
                    .workoutDays(new ArrayList<>())
                    .build();

            pushDay.setWorkoutPlan(ppl);
            pullDay.setWorkoutPlan(ppl);
            legsDay.setWorkoutPlan(ppl);
            ppl.getWorkoutDays().addAll(List.of(pushDay, pullDay, legsDay));
            ppl.setDaysPerWeek(ppl.getWorkoutDays().size());

            // --- Full Body Beginner ----------------------------------------------

            WorkoutDay fullBodyA = WorkoutDay.builder()
                    .dayNumber(1)
                    .name("Full Body A")
                    .workoutExercises(new ArrayList<>())
                    .build();
            fullBodyA.getWorkoutExercises().addAll(List.of(
                    WorkoutExercise.builder().exercise(barbellSquat).workoutDay(fullBodyA).sets(3).reps(10).weightKg(60.0).restSeconds(90).orderIndex(1).build(),
                    WorkoutExercise.builder().exercise(benchPress).workoutDay(fullBodyA).sets(3).reps(10).weightKg(60.0).restSeconds(90).orderIndex(2).build(),
                    WorkoutExercise.builder().exercise(seatedCableRow).workoutDay(fullBodyA).sets(3).reps(10).weightKg(50.0).restSeconds(90).orderIndex(3).build(),
                    WorkoutExercise.builder().exercise(overheadPress).workoutDay(fullBodyA).sets(3).reps(10).weightKg(40.0).restSeconds(90).orderIndex(4).build(),
                    WorkoutExercise.builder().exercise(plank).workoutDay(fullBodyA).sets(3).reps(30).weightKg(0.0).restSeconds(60).orderIndex(5).build()
            ));

            WorkoutDay fullBodyB = WorkoutDay.builder()
                    .dayNumber(2)
                    .name("Full Body B")
                    .workoutExercises(new ArrayList<>())
                    .build();
            fullBodyB.getWorkoutExercises().addAll(List.of(
                    WorkoutExercise.builder().exercise(deadlift).workoutDay(fullBodyB).sets(3).reps(8).weightKg(80.0).restSeconds(120).orderIndex(1).build(),
                    WorkoutExercise.builder().exercise(inclinePress).workoutDay(fullBodyB).sets(3).reps(10).weightKg(20.0).restSeconds(90).orderIndex(2).build(),
                    WorkoutExercise.builder().exercise(pullUp).workoutDay(fullBodyB).sets(3).reps(8).weightKg(0.0).restSeconds(90).orderIndex(3).build(),
                    WorkoutExercise.builder().exercise(lateralRaise).workoutDay(fullBodyB).sets(3).reps(15).weightKg(8.0).restSeconds(60).orderIndex(4).build(),
                    WorkoutExercise.builder().exercise(kettlebellSwing).workoutDay(fullBodyB).sets(3).reps(15).weightKg(24.0).restSeconds(60).orderIndex(5).build()
            ));

            WorkoutPlan fullBodyBeginner = WorkoutPlan.builder()
                    .name("Full Body Beginner")
                    .description("2-day full body program for beginners. Covers all major muscle groups with compound movements.")
                    .goal(FitnessGoal.GENERAL_FITNESS)
                    .experienceLevel(Level.BEGINNER)
                    .source(ContentSource.SYSTEM)
                    .isAiGenerated(false)
                    .workoutDays(new ArrayList<>())
                    .build();

            fullBodyA.setWorkoutPlan(fullBodyBeginner);
            fullBodyB.setWorkoutPlan(fullBodyBeginner);
            fullBodyBeginner.getWorkoutDays().addAll(List.of(fullBodyA, fullBodyB));
            fullBodyBeginner.setDaysPerWeek(fullBodyBeginner.getWorkoutDays().size());

            workoutPlanRepository.saveAll(List.of(ppl, fullBodyBeginner));
        }
    }
}
