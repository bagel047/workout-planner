package mk.ukim.finki.workoutplanner.web.response;

public record AuthResponse(
        String token,
        String username,
        String email,
        String displayName,
        String role
) {}
