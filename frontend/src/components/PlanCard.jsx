import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import muscleImg from "../assets/goals/muscle.jpg";
import fatLossImg from "../assets/goals/fatloss.jpg";
import strengthImg from "../assets/goals/strength.jpg";
import enduranceImg from "../assets/goals/endurance.jpg";
import flexibilityImg from "../assets/goals/flexibility.jpg";
import generalImg from "../assets/goals/generalfitness.jpg";

const GOAL_DATA = {
  MUSCLE_GAIN: { accent: "#c8a97e", image: muscleImg },
  FAT_LOSS: { accent: "#e07b54", image: fatLossImg },
  STRENGTH: { accent: "#7eb8d4", image: strengthImg },
  ENDURANCE: { accent: "#84c98a", image: enduranceImg },
  FLEXIBILITY: { accent: "#b48fd4", image: flexibilityImg },
  GENERAL_FITNESS: { accent: "#d4b84a", image: generalImg },
};

const sourceLabel = (source, isAiGenerated, username) => {
  if (source === "SYSTEM")
    return {
      label: "SYSTEM",
      style: {
        background: "rgba(0,0,0,0.4)",
        color: "rgba(248,244,238,0.65)",
        border: "0.5px solid rgba(255,255,255,0.15)",
      },
    };
  if (isAiGenerated)
    return {
      label: "AI",
      style: {
        background: "rgba(138,92,246,0.5)",
        color: "#e2d9ff",
        border: "0.5px solid rgba(138,92,246,0.4)",
      },
    };
  return {
    label: username || "MINE",
    style: {
      background: "rgba(0,0,0,0.4)",
      color: "#c8a97e",
      border: "0.5px solid rgba(200,169,126,0.3)",
    },
  };
};

export default function PlanCard({
  plan,
  username,
  hoveredPlan,
  setHoveredPlan,
}) {
  const navigate = useNavigate();
  const goalData = GOAL_DATA[plan.goal] || { accent: "#888", image: null };
  const src = sourceLabel(plan.source, plan.isAiGenerated, username);
  const isHovered = hoveredPlan === `card-${plan.id}`;

  return (
    <div
      onClick={() => navigate(`/plans/${plan.id}`)}
      onMouseEnter={() => setHoveredPlan(`card-${plan.id}`)}
      onMouseLeave={() => setHoveredPlan(null)}
      className="relative overflow-hidden rounded-xl cursor-pointer flex flex-col"
      style={{
        border: isHovered
          ? `0.5px solid ${goalData.accent}80`
          : "0.5px solid rgba(255,255,255,0.08)",
        transition: "all 0.25s ease",
        minHeight: "240px",
      }}
    >
      <div className="relative h-32 flex-shrink-0 overflow-hidden">
        {goalData.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${goalData.image})`,
              transform: isHovered ? "scale(1.05)" : "scale(1.0)",
              transition: "transform 0.5s ease",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: isHovered
              ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
            transition: "background 0.3s ease",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: `linear-gradient(to top, ${goalData.accent}30 0%, transparent 100%)`,
          }}
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span
            className="text-[10px] px-2 py-1 rounded-md font-medium backdrop-blur-sm"
            style={src.style}
          >
            {src.label}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded-md"
            style={{
              color: goalData.accent,
              background: "rgba(0,0,0,0.4)",
              border: `0.5px solid ${goalData.accent}40`,
            }}
          >
            {plan.goal?.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div
        className="flex flex-col flex-1 p-4"
        style={{ background: "rgba(30,30,30,0.95)" }}
      >
        <h3
          className="text-[#f8f4ee] font-semibold text-sm mb-1 leading-snug"
          style={{
            color: isHovered ? "#fff" : "#f8f4ee",
            transition: "color 0.2s ease",
          }}
        >
          {plan.name}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
          {plan.description}
        </p>
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/45">
              {plan.daysPerWeek}d/wk
            </span>
            <span className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/45">
              {plan.experienceLevel?.charAt(0) +
                plan.experienceLevel?.slice(1).toLowerCase()}
            </span>
          </div>
          <ArrowRight
            className="w-3.5 h-3.5 transition-all"
            style={{
              color: isHovered ? goalData.accent : "rgba(255,255,255,0.2)",
              transform: isHovered ? "translateX(2px)" : "translateX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
