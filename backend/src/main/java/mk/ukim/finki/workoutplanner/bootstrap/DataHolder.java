package mk.ukim.finki.workoutplanner.bootstrap;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;
import mk.ukim.finki.workoutplanner.repository.ExerciseRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataHolder {

    private final ExerciseRepository exerciseRepository;

    @PostConstruct
    public void init() {
        if (exerciseRepository.count() > 0) return;

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
}
