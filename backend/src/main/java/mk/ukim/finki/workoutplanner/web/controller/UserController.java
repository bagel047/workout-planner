package mk.ukim.finki.workoutplanner.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.service.UserService;
import mk.ukim.finki.workoutplanner.web.request.ChangePasswordRequest;
import mk.ukim.finki.workoutplanner.web.request.UpdateUserRequest;
import mk.ukim.finki.workoutplanner.web.response.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe() {
        return ResponseEntity.ok(UserResponse.from(userService.getMe()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(UserResponse.from(userService.updateMe(request)));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMe() {
        userService.deleteMe();
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
