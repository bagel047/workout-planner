package mk.ukim.finki.workoutplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException() {
        super("You do not have permission to perform this action.");
    }
}
