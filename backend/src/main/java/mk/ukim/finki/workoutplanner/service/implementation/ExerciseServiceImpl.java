package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.exception.ExerciseNotFoundException;
import mk.ukim.finki.workoutplanner.exception.UnauthorizedAccessException;
import mk.ukim.finki.workoutplanner.model.entity.Exercise;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;
import mk.ukim.finki.workoutplanner.repository.ExerciseRepository;
import mk.ukim.finki.workoutplanner.service.ExerciseService;
import mk.ukim.finki.workoutplanner.util.SecurityUtil;
import mk.ukim.finki.workoutplanner.web.request.ExerciseRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static mk.ukim.finki.workoutplanner.service.FieldFilterSpecification.*;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Override
    public Page<Exercise> findAccessible(String name, String description,
                                         MuscleGroup muscleGroup, EquipmentType equipmentType, Level difficultyLevel,
                                         Integer pageNum, Integer pageSize) {

        User currentUser = SecurityUtil.getCurrentUser();
        Specification<Exercise> accessFilter;

        if(currentUser != null)
            accessFilter = Specification.anyOf(
                    filterEqualsV(Exercise.class, "source", ContentSource.SYSTEM),
                    filterEquals(Exercise.class, "createdBy.id", currentUser.getId()));
        else
            accessFilter = filterEqualsV(Exercise.class, "source", ContentSource.SYSTEM);

        Specification<Exercise> specification = Specification.allOf(
                accessFilter,
                filterContainsText(Exercise.class, "name", name),
                filterContainsText(Exercise.class, "description", description),
                filterEqualsV(Exercise.class, "muscleGroup", muscleGroup),
                filterEqualsV(Exercise.class, "equipmentType", equipmentType),
                filterEqualsV(Exercise.class, "difficultyLevel", difficultyLevel)
        );

        return exerciseRepository.findAll(specification,
                PageRequest.of(pageNum, pageSize, Sort.by(Sort.Direction.ASC, "name")));
    }

    @Override
    public Exercise findById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException(id));

        if (exercise.getSource() == ContentSource.SYSTEM) {
            return exercise; // SYSTEM exercises are public
        }

        User currentUser = SecurityUtil.getCurrentUser();
        if (!exercise.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException();
        }

        return exercise;
    }

    @Override
    public Exercise create(ExerciseRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();

        Exercise exercise = Exercise.builder()
                .name(request.name())
                .description(request.description())
                .muscleGroup(request.muscleGroup())
                .difficultyLevel(request.difficultyLevel())
                .equipmentType(request.equipmentType())
                .videoUrl(request.videoUrl())
                .source(ContentSource.USER)
                .createdBy(currentUser)
                .build();

        return exerciseRepository.save(exercise);
    }

    @Override
    public Exercise update(Long id, ExerciseRequest request) {
        Exercise exercise = findById(id);
        User currentUser = SecurityUtil.getCurrentUser();

        if (!exercise.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only edit your own exercises");
        }

        exercise.setName(request.name());
        exercise.setDescription(request.description());
        exercise.setMuscleGroup(request.muscleGroup());
        exercise.setEquipmentType(request.equipmentType());
        exercise.setDifficultyLevel(request.difficultyLevel());
        exercise.setVideoUrl(request.videoUrl());

        return exerciseRepository.save(exercise);
    }

    @Override
    public void delete(Long id) {
        Exercise exercise = findById(id);
        User currentUser = SecurityUtil.getCurrentUser();

        if (!exercise.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only delete your own exercises");
        }

        exerciseRepository.delete(exercise);
    }
}
