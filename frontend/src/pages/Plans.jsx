import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import { Sparkles, Plus, ArrowRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanCard from "../components/PlanCard";

import muscleImg from "../assets/goals/muscle1.jpg";
import fatLossImg from "../assets/goals/fatloss.jpg";
import strengthImg from "../assets/goals/strength.jpg";
import enduranceImg from "../assets/goals/endurance.jpg";
import flexibilityImg from "../assets/goals/flexibility.jpg";
import generalImg from "../assets/goals/generalfitness.jpg";

const GOALS = [
  {
    key: "MUSCLE_GAIN",
    label: "Muscle Gain",
    tagline: "Build size\nand strength",
    description:
      "Progressive overload programs focused on hypertrophy and compound lifts.",
    image: muscleImg,
    accent: "#c8a97e",
  },
  {
    key: "FAT_LOSS",
    label: "Fat Loss",
    tagline: "Burn fat,\nstay lean",
    description:
      "High-intensity programs combining strength and cardio to maximize calorie burn.",
    image: fatLossImg,
    accent: "#e07b54",
  },
  {
    key: "STRENGTH",
    label: "Strength",
    tagline: "Lift heavier,\nget stronger",
    description:
      "Powerlifting-style programs built around the squat, bench, and deadlift.",
    image: strengthImg,
    accent: "#7eb8d4",
  },
  {
    key: "ENDURANCE",
    label: "Endurance",
    tagline: "Go further,\nlast longer",
    description:
      "Cardio-focused training plans built to improve stamina and aerobic capacity.",
    image: enduranceImg,
    accent: "#84c98a",
  },
  {
    key: "FLEXIBILITY",
    label: "Flexibility",
    tagline: "Move freely,\nrecover faster",
    description:
      "Mobility and stretching focused programs to improve range of motion.",
    image: flexibilityImg,
    accent: "#b48fd4",
  },
  {
    key: "GENERAL_FITNESS",
    label: "General Fitness",
    tagline: "Move well,\nfeel great",
    description:
      "Balanced programs for overall health, mobility, and athletic performance.",
    image: generalImg,
    accent: "#d4b84a",
  },
];

function MobileGoalCard({ goal, goalPlans }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const plans = goalPlans[goal.key] || [];

  return (
    <div
      className="relative overflow-hidden rounded-xl cursor-pointer"
      style={{
        height: expanded ? "340px" : "80px",
        transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
      onClick={() => navigate(`/plans/goal/${goal.key}`)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${goal.image})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: expanded
            ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.25) 100%)"
            : "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center px-5 gap-3"
        style={{ opacity: expanded ? 0 : 1, transition: "opacity 0.2s ease" }}
      >
        <span
          className="text-sm font-semibold flex-1"
          style={{ color: goal.accent }}
        >
          {goal.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg z-10"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "rgba(248,244,238,0.6)",
          }}
        >
          Preview
        </button>
        <ArrowRight
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: goal.accent }}
        />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 p-5"
        style={{
          opacity: expanded ? 1 : 0,
          transform: expanded ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s",
          pointerEvents: expanded ? "auto" : "none",
        }}
      >
        <span
          className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{
            background: `${goal.accent}25`,
            color: goal.accent,
            border: `0.5px solid ${goal.accent}40`,
          }}
        >
          {goal.label}
        </span>
        <h3 className="text-[#f8f4ee] text-lg font-bold mb-2 leading-snug whitespace-pre-line">
          {goal.tagline}
        </h3>
        <p className="text-white/45 text-xs leading-relaxed mb-4 max-w-xs">
          {goal.description}
        </p>
        {plans.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/plans/${plan.id}`);
                }}
                className="flex justify-between items-center rounded-lg px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
              >
                <span className="text-[#f8f4ee] text-xs">{plan.name}</span>
                <span className="text-white/35 text-[10px]">
                  {plan.daysPerWeek}d/wk
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/plans/goal/${goal.key}`);
          }}
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg"
          style={{ background: goal.accent, color: "#1a1a1a" }}
        >
          View all plans <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function DesktopAccordion({
  goals,
  goalPlans,
  hoveredPlan,
  onPlanHover,
  onPlanLeave,
}) {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  return (
    <div
      style={{
        position: "relative",
        height: "520px",
        display: "flex",
        gap: "8px",
        contentVisibility: "auto",
      }}
      onMouseLeave={() => setActive(null)}
    >
      {goals.map((goal, i) => {
        const isActive = active === goal.key;
        const hasActive = active !== null;
        const plans = goalPlans[goal.key] || [];

        return (
          <div
            key={goal.key}
            onMouseEnter={() => setActive(goal.key)}
            onClick={() => navigate(`/plans/goal/${goal.key}`)}
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: "6px",
              flex: isActive ? "3.5" : hasActive ? "0.35" : "1",
              minWidth: 0,
              transition: "flex 380ms cubic-bezier(0.4,0,0.2,1)",
              willChange: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${goal.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.04)" : "scale(1)",
                transition: "transform 400ms ease",
                willChange: "transform",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                opacity: isActive ? 0.5 : 1,
                transition: "opacity 240ms ease",
                willChange: "opacity",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "180px",
                background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100px",
                background: `linear-gradient(to top, ${goal.accent}30 0%, transparent 100%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: "20px",
                opacity: isActive ? 0 : 1,
                transition: "opacity 160ms ease",
                pointerEvents: "none",
                willChange: "opacity",
              }}
            >
              <span
                style={{
                  color: goal.accent,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.08em",
                  fontSize: "13px",
                  display: "block",
                }}
              >
                {goal.label}
              </span>
            </div>

            {/* Expanded content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "28px",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(12px)",
                transition: isActive
                  ? "opacity 260ms ease 120ms, transform 260ms ease 120ms"
                  : "opacity 150ms ease, transform 150ms ease",
                pointerEvents: isActive ? "auto" : "none",
                willChange: "opacity, transform",
              }}
            >
              <span
                className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{
                  background: `${goal.accent}25`,
                  color: goal.accent,
                  border: `0.5px solid ${goal.accent}40`,
                }}
              >
                {goal.label}
              </span>
              <h3 className="text-[#f8f4ee] text-2xl font-bold mb-3 leading-snug whitespace-pre-line">
                {goal.tagline}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-5 max-w-xs">
                {goal.description}
              </p>

              {plans.length > 0 && (
                <div className="flex flex-col gap-2 mb-5">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plans/${plan.id}`);
                      }}
                      onMouseEnter={() => onPlanHover(`preview-${plan.id}`)}
                      onMouseLeave={onPlanLeave}
                      className="flex justify-between items-center rounded-lg px-3 py-2.5 cursor-pointer"
                      style={{
                        background:
                          hoveredPlan === `preview-${plan.id}`
                            ? "rgba(255,255,255,0.14)"
                            : "rgba(255,255,255,0.07)",
                        border:
                          hoveredPlan === `preview-${plan.id}`
                            ? `0.5px solid ${goal.accent}60`
                            : "0.5px solid rgba(255,255,255,0.12)",
                        transition:
                          "background 120ms ease, border-color 120ms ease",
                      }}
                    >
                      <span className="text-[#f8f4ee] text-xs font-medium">
                        {plan.name}
                      </span>
                      <span className="text-white/35 text-[10px]">
                        {plan.daysPerWeek}d/wk
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/plans/goal/${goal.key}`);
                }}
                className="flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90"
                style={{ background: goal.accent, color: "#1a1a1a" }}
              >
                View all plans <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goalPlans, setGoalPlans] = useState({});
  const [myPlans, setMyPlans] = useState([]);
  const [myPlansLoading, setMyPlansLoading] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const ACTIVE = "#c8f135";

  useEffect(() => {
    GOALS.forEach((goal) => {
      const img = new Image();
      img.src = goal.image;
    });
  }, []);

  useEffect(() => {
    const prefetch = async () => {
      for (const goal of GOALS) {
        try {
          const res = await axiosInstance.get(
            `/plans?goal=${goal.key}&pageNum=0&pageSize=2`,
          );
          setGoalPlans((prev) => ({ ...prev, [goal.key]: res.data.content }));
        } catch {}
        await new Promise((r) => setTimeout(r, 100));
      }
    };
    prefetch();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchMyPlans = async () => {
      setMyPlansLoading(true);
      try {
        const res = await axiosInstance.get(
          `/plans?source=USER&pageNum=0&pageSize=6`,
        );
        setMyPlans(res.data.content);
      } catch {
        toast.error("Failed to load your plans");
      } finally {
        setMyPlansLoading(false);
      }
    };
    fetchMyPlans();
  }, [user]);

  const handlePlanHover = useCallback((id) => setHoveredPlan(id), []);
  const handlePlanLeave = useCallback(() => setHoveredPlan(null), []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="pt-36 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">
              Training programs
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#f8f4ee] leading-[1.0] mb-5">
              Find your
              <br />
              perfect plan.
            </h1>
            <p className="text-white/45 text-base max-w-md leading-relaxed">
              Browse curated workout programs by goal, or let AI build one
              tailored specifically to you.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => navigate("/generate")}
              variant="secondary"
              className="gap-2 cursor-pointer hover:opacity-80 text-base"
              style={{ background: ACTIVE, color: "#1a1a1a" }}
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
            <Button
              onClick={() => navigate("/plans/new")}
              variant="outline"
              className="h-10 gap-2 border-white/20 text-white/60 hover:bg-white/8 hover:text-white bg-transparent cursor-pointer text-base"
            >
              <Plus className="w-4 h-4" />
              Create plan
            </Button>
          </div>
        </div>
      </div>

      {/* Accordion Desktop */}
      <div className="hidden lg:block px-6 lg:px-24 max-w-7xl mx-auto pb-28">
        <DesktopAccordion
          goals={GOALS}
          goalPlans={goalPlans}
          hoveredPlan={hoveredPlan}
          onPlanHover={handlePlanHover}
          onPlanLeave={handlePlanLeave}
        />
      </div>

      {/* Accordion mobile vertical */}
      <div className="lg:hidden px-6 max-w-7xl mx-auto pb-28 flex flex-col gap-3">
        {GOALS.map((goal) => (
          <MobileGoalCard key={goal.key} goal={goal} goalPlans={goalPlans} />
        ))}
      </div>

      {/* My Plans */}
      {user && (
        <div className="px-6 lg:px-24 max-w-7xl mx-auto pb-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-2">
                Your training
              </p>
              <h2 className="text-3xl font-bold text-[#f8f4ee]">My Plans</h2>
            </div>
            <button
              onClick={() => navigate("/plans/myplans")}
              className="text-sm text-white/35 hover:text-white/70 transition-colors cursor-pointer hover:text-white"
            >
              View all →
            </button>
          </div>

          {myPlansLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-white/15 border-t-[#c8a97e] rounded-full animate-spin" />
            </div>
          ) : myPlans.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-14 flex flex-col items-center justify-center gap-4 text-center">
              <Dumbbell className="w-10 h-10 text-white/10" />
              <p className="text-white/30 text-sm">
                You haven't created any plans yet
              </p>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => navigate("/generate")}
                  size="sm"
                  variant="secondary"
                  className="gap-2 cursor-pointer hover:opacity-80 text-base"
                  style={{ background: ACTIVE, color: "#1a1a1a" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Generate with AI
                </Button>
                <Button
                  onClick={() => navigate("/plans/new")}
                  size="sm"
                  variant="outline"
                  className="h-8 border-white/15 text-white/50 hover:bg-white/5 bg-transparent cursor-pointer text-base"
                >
                  Create yours
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8">
              {myPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  username={user?.username}
                  hoveredPlan={hoveredPlan}
                  setHoveredPlan={setHoveredPlan}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
