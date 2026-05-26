package mk.ukim.finki.workoutplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class SessionSetNotFoundException extends RuntimeException {
    public SessionSetNotFoundException(Long id) {
        super(String.format("Session set with id %d does not exist.", id));
    }
}