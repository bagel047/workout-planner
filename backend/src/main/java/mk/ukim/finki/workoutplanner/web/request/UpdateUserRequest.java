package mk.ukim.finki.workoutplanner.web.request;

public record UpdateUserRequest(
        String displayName,
        String avatarUrl
) {}
