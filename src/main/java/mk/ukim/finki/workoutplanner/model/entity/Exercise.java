package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;
import mk.ukim.finki.workoutplanner.model.enums.ContentSource;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.Level;
import mk.ukim.finki.workoutplanner.model.enums.MuscleGroup;

@Entity
@Table(name="exercises")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MuscleGroup muscleGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentType equipmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Level difficultyLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentSource source;       // SYSTEM or USER

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;             // null for SYSTEM created exercises
}
