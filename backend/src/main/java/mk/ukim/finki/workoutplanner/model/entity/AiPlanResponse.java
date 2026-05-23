package mk.ukim.finki.workoutplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_plan_responses")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AiPlanResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rawResponse;       // full text back from OpenAI

    private Boolean parsedSuccessfully;

    private String parseErrorMessage;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private AiPlanRequest request;

    @OneToOne
    @JoinColumn(name = "generated_plan_id")
    private WorkoutPlan generatedPlan; // null if parsing failed
}
