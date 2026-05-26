package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="workout_exercises")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class WorkoutExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer sets;
    private Integer reps;
    private Double weightKg;
    private Integer restSeconds;
    private Integer orderIndex;
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id", nullable = false)
    private WorkoutDay workoutDay;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
