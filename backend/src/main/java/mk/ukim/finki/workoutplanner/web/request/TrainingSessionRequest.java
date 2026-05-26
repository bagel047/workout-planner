package mk.ukim.finki.workoutplanner.web.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public record TrainingSessionRequest(

        @NotNull(message = "Date is required")
        LocalDate date,

        @Positive(message = "Duration must be positive")
        Integer durationMinutes,

        String notes,

        Long workoutDayId,        // nullable: free session

        List<SessionSetRequest> sets
) {}