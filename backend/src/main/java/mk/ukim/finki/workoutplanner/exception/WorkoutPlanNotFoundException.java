package mk.ukim.finki.workoutplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class WorkoutPlanNotFoundException extends RuntimeException {
    public WorkoutPlanNotFoundException(Long id) {
        super(String.format("Workout plan with id %d does not exist.", id));
    }
}