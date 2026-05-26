package mk.ukim.finki.workoutplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class WorkoutExerciseNotFoundException extends RuntimeException {

    public WorkoutExerciseNotFoundException(Long id) {
        super(String.format("Workout exercise with id %d does not exist.", id));
    }
}
