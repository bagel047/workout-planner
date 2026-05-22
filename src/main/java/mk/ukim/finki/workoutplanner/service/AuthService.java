package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.web.request.LoginRequest;
import mk.ukim.finki.workoutplanner.web.request.RegisterRequest;
import mk.ukim.finki.workoutplanner.web.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse toAuthResponse(User user, String token);
}
