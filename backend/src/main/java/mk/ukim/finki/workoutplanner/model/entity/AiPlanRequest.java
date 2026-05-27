package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;
import mk.ukim.finki.workoutplanner.model.enums.EquipmentType;
import mk.ukim.finki.workoutplanner.model.enums.FitnessGoal;
import mk.ukim.finki.workoutplanner.model.enums.Level;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ai_plan_requests")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AiPlanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FitnessGoal goal;

    @Enumerated(EnumType.STRING)
    private Level experienceLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ai_plan_request_equipment",
            joinColumns = @JoinColumn(name = "ai_plan_request_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "equipment_type")
    private List<EquipmentType> availableEquipment;

    private Integer daysPerWeek;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(columnDefinition = "TEXT")
    private String rawPrompt;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL)
    private AiPlanResponse response;
}
