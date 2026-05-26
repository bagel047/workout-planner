package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="workout_plans")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private FitnessGoal goal;

    private Integer daysPerWeek;

    @Enumerated(EnumType.STRING)
    private Level experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentSource source;

    @Builder.Default
    private Boolean isAiGenerated = false;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;             // null for SYSTEM plans

    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("dayNumber ASC")
    private List<WorkoutDay> workoutDays;
}
