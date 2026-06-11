package mk.ukim.finki.workoutplanner.service.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.service.AiPlanLogService;
import mk.ukim.finki.workoutplanner.web.response.AiNewExerciseResponse;
import mk.ukim.finki.workoutplanner.web.response.AiWorkoutExerciseResponse;
import mk.ukim.finki.workoutplanner.web.response.AiWorkoutDayResponse;
import mk.ukim.finki.workoutplanner.web.response.AiWorkoutPlanResponse;
import mk.ukim.finki.workoutplanner.model.entity.*;
import mk.ukim.finki.workoutplanner.model.enums.*;
import mk.ukim.finki.workoutplanner.repository.*;
import mk.ukim.finki.workoutplanner.service.AiPlanService;
import mk.ukim.finki.workoutplanner.util.SecurityUtil;
import mk.ukim.finki.workoutplanner.web.request.AiGenerateRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiPlanServiceImpl implements AiPlanService {

    private final ChatClient chatClient;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final AiPlanRequestRepository aiPlanRequestRepository;
    private final AiPlanResponseRepository aiPlanResponseRepository;
    private final AiPlanLogService aiPlanLogService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public WorkoutPlan generate(AiGenerateRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();

        // fetch all accessible exercises to include in prompt
        List<MuscleGroup> relevantGroups = relevantMuscleGroups(request.goal());

        List<Exercise> availableExercises = exerciseRepository.findAll().stream()
                .filter(e -> (request.availableEquipment().contains(e.getEquipmentType())
                        || e.getEquipmentType() == EquipmentType.BODYWEIGHT)
                        && relevantGroups.contains(e.getMuscleGroup()))
                .toList();

        String prompt = buildPrompt(request, availableExercises);

//        AiPlanRequest aiPlanRequest = AiPlanRequest.builder()
//                .goal(FitnessGoal.valueOf(request.goal().name()))
//                .experienceLevel(Level.valueOf(request.experienceLevel().name()))
//                .daysPerWeek(request.daysPerWeek())
//                .availableEquipment(request.availableEquipment())
//                .additionalNotes(request.additionalNotes())
//                .rawPrompt(prompt)
//                .user(currentUser)
//                .build();
//        aiPlanRequestRepository.save(aiPlanRequest);
        AiPlanRequest aiPlanRequest = aiPlanLogService.saveRequest(request, prompt, currentUser);

        // call to Groq via spring ai
        String rawResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        String cleanedResponse = rawResponse
                .replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();

        WorkoutPlan generatedPlan = null;
        boolean parsedSuccessfully = false;
        String parseError = null;

        try {
            AiWorkoutPlanResponse aiResponse = objectMapper.readValue(cleanedResponse, AiWorkoutPlanResponse.class);
            generatedPlan = buildWorkoutPlan(aiResponse, currentUser);
            workoutPlanRepository.save(generatedPlan);
            parsedSuccessfully = true;

            aiPlanLogService.saveResponseInCurrentTransaction(aiPlanRequest, rawResponse, true, null, generatedPlan);

        } catch (Exception e) {
            parseError = e.getMessage();

            aiPlanLogService.saveResponse(aiPlanRequest, rawResponse, false, parseError, null);
        }

//        AiPlanResponse aiPlanResponse = AiPlanResponse.builder()
//                .request(aiPlanRequest)
//                .rawResponse(rawResponse)
//                .parsedSuccessfully(parsedSuccessfully)
//                .parseErrorMessage(parseError)
//                .generatedPlan(generatedPlan)
//                .build();
//        aiPlanResponseRepository.save(aiPlanResponse);

        if (!parsedSuccessfully) {
            throw new RuntimeException("AI plan generation failed: " + parseError);
        }

        return generatedPlan;
    }

    private WorkoutPlan buildWorkoutPlan(AiWorkoutPlanResponse aiResponse, User user) {
        WorkoutPlan plan = WorkoutPlan.builder()
                .name(aiResponse.name())
                .description(aiResponse.description())
                .goal(FitnessGoal.valueOf(aiResponse.goal()))
                .experienceLevel(Level.valueOf(aiResponse.experienceLevel()))
                .source(ContentSource.USER)
                .isAiGenerated(true)
                .user(user)
                .workoutDays(new ArrayList<>())
                .build();

        for (AiWorkoutDayResponse dayResponse : aiResponse.days()) {
            WorkoutDay day = WorkoutDay.builder()
                    .dayNumber(dayResponse.dayNumber())
                    .name(dayResponse.name())
                    .workoutPlan(plan)
                    .workoutExercises(new ArrayList<>())
                    .build();

            for (AiWorkoutExerciseResponse exResponse : dayResponse.exercises()) {
                Exercise exercise = resolveExercise(exResponse);

                WorkoutExercise workoutExercise = WorkoutExercise.builder()
                        .exercise(exercise)
                        .workoutDay(day)
                        .sets(exResponse.sets())
                        .reps(exResponse.reps())
                        .weightKg(exResponse.weightKg())
                        .restSeconds(exResponse.restSeconds())
                        .orderIndex(exResponse.orderIndex())
                        .notes(exResponse.notes())
                        .build();

                day.getWorkoutExercises().add(workoutExercise);
            }

            plan.getWorkoutDays().add(day);
        }

        plan.setDaysPerWeek(plan.getWorkoutDays().size());
        return plan;
    }

    private Exercise resolveExercise(AiWorkoutExerciseResponse exResponse) {
        if (exResponse.existingExerciseId() != null) {
            return exerciseRepository.findById(exResponse.existingExerciseId())
                    .orElseThrow(() -> new RuntimeException(
                            "AI referenced non-existent exercise id: " + exResponse.existingExerciseId()));
        }

        // create new AI exercise
        AiNewExerciseResponse newEx = exResponse.newExercise();
        Exercise exercise = Exercise.builder()
                .name(newEx.name())
                .description(newEx.description())
                .muscleGroup(MuscleGroup.valueOf(newEx.muscleGroup()))
                .equipmentType(EquipmentType.valueOf(newEx.equipmentType()))
                .difficultyLevel(Level.valueOf(newEx.difficultyLevel()))
                .source(ContentSource.AI)
                .build();

        return exerciseRepository.save(exercise);
    }

    private String buildPrompt(AiGenerateRequest request, List<Exercise> availableExercises) {
        String exerciseList = availableExercises.stream()
                .map(e -> String.format(
                        "  {\"id\":%d,\"name\":\"%s\",\"description\":\"%s\",\"muscleGroup\":\"%s\",\"equipmentType\":\"%s\",\"difficultyLevel\":\"%s\"}",
                        e.getId(),
                        e.getName(),
                        e.getDescription() != null ? e.getDescription() : "",
                        e.getMuscleGroup(),
                        e.getEquipmentType(),
                        e.getDifficultyLevel()))
                .collect(Collectors.joining(",\n"));

        String equipmentList = request.availableEquipment().stream()
                .map(Enum::name)
                .collect(Collectors.joining(", "));

        return String.format("""
                        You are an expert fitness coach and workout programmer. Your task is to generate a personalized workout plan.
                        
                        USER PARAMETERS:
                        - Fitness goal: %s
                        - Experience level: %s
                        - Days per week: %d
                        - Available equipment: %s
                        - Additional notes: %s
                        
                        EXISTING EXERCISES IN OUR SYSTEM (prefer these when suitable):
                        [
                        %s
                        ]
                        
                        INSTRUCTIONS:
                        1. Generate a complete workout plan for %d days per week tailored to the user's goal and experience level.
                        2. For each exercise in the plan, you have two options:
                           a) USE AN EXISTING EXERCISE: set "existingExerciseId" to its id from the list above, leave "newExercise" as null.
                           b) ADD A NEW EXERCISE: set "existingExerciseId" to null, and fill in the "newExercise" object with all required fields.
                        3. Prefer existing exercises when they fit the plan. Only add new exercises when the existing ones are insufficient for a well-rounded plan.
                        4. For new exercises, all enum values must be EXACTLY one of the following:
                           - muscleGroup: CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, LEGS, GLUTES, HAMSTRINGS, QUADS, CORE, FULL_BODY, CARDIO
                           - equipmentType: BARBELL, DUMBBELL, MACHINE, CABLE, BODYWEIGHT, RESISTANCE_BAND, KETTLEBELL, OTHER
                           - difficultyLevel: BEGINNER, INTERMEDIATE, ADVANCED
                        5. sets, reps, restSeconds, weightKg and orderIndex must always be provided for every exercise entry.
                        6. weightKg should reflect a realistic starting weight for the experience level and goal. Use 0.0 for bodyweight exercises.
                        7. Days must be numbered 1 through %d and named descriptively (e.g. "Push Day - Chest, Shoulders, Triceps").
                        8. The plan name and description should be informative and motivating.
                        9. Return ONLY the JSON object. No markdown, no code blocks, no explanation, no extra text whatsoever.
                        
                        REQUIRED JSON FORMAT:
                        {
                          "name": "Plan name here",
                          "description": "Plan description here",
                          "goal": "%s",
                          "experienceLevel": "%s",
                          "days": [
                            {
                              "dayNumber": 1,
                              "name": "Day name here",
                              "exercises": [
                                {
                                  "existingExerciseId": 1,
                                  "sets": 4,
                                  "reps": 8,
                                  "weightKg": 80.0,
                                  "restSeconds": 90,
                                  "orderIndex": 1,
                                  "notes": "optional coaching note or null",
                                  "newExercise": null
                                },
                                {
                                  "existingExerciseId": null,
                                  "sets": 3,
                                  "reps": 12,
                                  "weightKg": 15.0,
                                  "restSeconds": 60,
                                  "orderIndex": 2,
                                  "notes": "optional coaching note or null",
                                  "newExercise": {
                                    "name": "Exercise name",
                                    "description": "Exercise description",
                                    "muscleGroup": "CHEST",
                                    "equipmentType": "CABLE",
                                    "difficultyLevel": "INTERMEDIATE"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                        """,
                request.goal(),
                request.experienceLevel(),
                request.daysPerWeek(),
                equipmentList,
                request.additionalNotes() != null ? request.additionalNotes() : "none",
                exerciseList,
                request.daysPerWeek(),
                request.daysPerWeek(),
                request.goal(),
                request.experienceLevel()
        );
    }

    private List<MuscleGroup> relevantMuscleGroups(FitnessGoal goal) {
        return switch (goal) {
            case MUSCLE_GAIN, STRENGTH -> List.of(
                    MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS,
                    MuscleGroup.BICEPS, MuscleGroup.TRICEPS, MuscleGroup.LEGS,
                    MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS, MuscleGroup.QUADS);
            case FAT_LOSS, ENDURANCE -> List.of(
                    MuscleGroup.FULL_BODY, MuscleGroup.CARDIO, MuscleGroup.LEGS,
                    MuscleGroup.CORE, MuscleGroup.BACK, MuscleGroup.CHEST);
            case FLEXIBILITY -> List.of(
                    MuscleGroup.FULL_BODY, MuscleGroup.CORE);
            case GENERAL_FITNESS -> List.of(MuscleGroup.values()); // all
        };
    }
}