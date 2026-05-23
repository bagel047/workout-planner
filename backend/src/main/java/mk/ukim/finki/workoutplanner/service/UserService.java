package mk.ukim.finki.workoutplanner.service;

import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.web.request.ChangePasswordRequest;
import mk.ukim.finki.workoutplanner.web.request.UpdateUserRequest;

public interface UserService {
    User getMe();

    User updateMe(UpdateUserRequest request);

    void deleteMe();

    void changePassword(ChangePasswordRequest request);
}
