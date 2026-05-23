package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="session_sets")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SessionSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer repsCompleted;
    private Double weightKg;
    private Integer rpe;           // rate of perceived exertion (1–10)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_session_id", nullable = false)
    private TrainingSession trainingSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_exercise_id")
    private WorkoutExercise workoutExercise;  // nullable for unplanned exercises
}
