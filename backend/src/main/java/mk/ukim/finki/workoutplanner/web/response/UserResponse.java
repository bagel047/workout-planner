package mk.ukim.finki.workoutplanner.web.response;

import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.enums.AuthProvider;
import mk.ukim.finki.workoutplanner.model.enums.Role;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String displayName,
        String avatarUrl,
        Role role,
        AuthProvider provider,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getProvider(),
                user.getCreatedAt()
        );
    }
}