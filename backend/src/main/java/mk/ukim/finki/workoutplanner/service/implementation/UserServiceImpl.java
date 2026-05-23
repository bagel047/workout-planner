package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.enums.AuthProvider;
import mk.ukim.finki.workoutplanner.repository.UserRepository;
import mk.ukim.finki.workoutplanner.service.UserService;
import mk.ukim.finki.workoutplanner.util.SecurityUtil;
import mk.ukim.finki.workoutplanner.web.request.ChangePasswordRequest;
import mk.ukim.finki.workoutplanner.web.request.UpdateUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getMe() {
        return SecurityUtil.getCurrentUser();
    }

    @Override
    public User updateMe(UpdateUserRequest request) {
        User user = SecurityUtil.getCurrentUser();

        if (request.displayName() != null && !request.displayName().isBlank()) {
            user.setDisplayName(request.displayName());
        }
        if (request.avatarUrl() != null && !request.avatarUrl().isBlank()) {
            user.setAvatarUrl(request.avatarUrl());
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteMe() {
        User user = SecurityUtil.getCurrentUser();
        userRepository.delete(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = SecurityUtil.getCurrentUser();

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new IllegalArgumentException("Password change is only available for local accounts");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
