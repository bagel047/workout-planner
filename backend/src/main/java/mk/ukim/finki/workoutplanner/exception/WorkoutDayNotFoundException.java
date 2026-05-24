package mk.ukim.finki.workoutplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class WorkoutDayNotFoundException extends RuntimeException {
    public WorkoutDayNotFoundException(Long id) {
        super(String.format("Workout day with id %d does not exist.", id));
    }
}