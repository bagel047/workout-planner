import { useState, useEffect } from "react";
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

// Mobile vertical card
function MobileGoalCard({ goal, goalPlans, fetchGoalPlans }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const plans = goalPlans[goal.key] || [];

  const handleToggle = () => {
    if (!expanded) fetchGoalPlans(goal.key);
    setExpanded((e) => !e);
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl cursor-pointer"
      style={{
        height: expanded ? "340px" : "80px",
        transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
      onClick={handleToggle}
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

      {/* Collapsed row */}
      <div
        className="absolute inset-0 flex items-center px-5 gap-3"
        style={{ opacity: expanded ? 0 : 1, transition: "opacity 0.2s ease" }}
      >
        <span className="text-sm font-semibold" style={{ color: goal.accent }}>
          {goal.label}
        </span>
        <ArrowRight
          className="w-3.5 h-3.5 ml-auto"
          style={{ color: goal.accent }}
        />
      </div>

      {/* Expanded content */}
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

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const [goalPlans, setGoalPlans] = useState({});
  const [myPlans, setMyPlans] = useState([]);
  const [myPlansLoading, setMyPlansLoading] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  useEffect(() => {
    const prefetch = async () => {
      const results = {};
      await Promise.all(
        GOALS.map(async (goal) => {
          try {
            const res = await axiosInstance.get(
              `/plans?goal=${goal.key}&pageNum=0&pageSize=2`,
            );
            results[goal.key] = res.data.content;
          } catch {}
        }),
      );
      setGoalPlans(results);
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

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
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

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/generate")}
              className="gap-2"
              style={{ background: "#c8a97e", color: "#1a1a1a" }}
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
            <Button
              onClick={() => navigate("/plans/new")}
              variant="outline"
              className="gap-2 border-white/20 text-white/60 hover:bg-white/8 hover:text-white bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Create plan
            </Button>
          </div>
        </div>
      </div>

      {/* Accordion Desktop */}
      <div className="hidden lg:block px-6 lg:px-24 max-w-7xl mx-auto pb-28">
        <div
          className="flex gap-2 rounded-md overflow-hidden"
          style={{ height: "520px" }}
        >
          {GOALS.map((goal) => {
            const isHovered = hoveredGoal === goal.key;
            const plans = goalPlans[goal.key] || [];

            return (
              <div
                key={goal.key}
                className="relative overflow-hidden cursor-pointer rounded-md"
                style={{
                  flex: isHovered ? "3.5" : hoveredGoal ? "0.35" : "1",
                  transition: "flex 0.55s cubic-bezier(0.4,0,0.2,1)",
                  minWidth: "48px",
                }}
                onMouseEnter={() => {
                  setHoveredGoal(goal.key);
                }}
                onMouseLeave={() => setHoveredGoal(null)}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${goal.image})`,
                    transform: isHovered ? "scale(1.02)" : "scale(1.0)",
                    transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: isHovered
                      ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.2) 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 100%)",
                    transition: "background 0.4s ease",
                  }}
                />

                <div
                  className="absolute bottom-0 left-0 right-0 h-32"
                  style={{
                    background: `linear-gradient(to top, ${goal.accent}22 0%, transparent 100%)`,
                  }}
                />

                <div
                  className="absolute bottom-0 left-0 p-5"
                  style={{
                    opacity: isHovered ? 0 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <span
                    className="font-semibold whitespace-nowrap"
                    style={{
                      color: goal.accent,
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      letterSpacing: "0.08em",
                      fontSize: "13px",
                    }}
                  >
                    {goal.label}
                  </span>
                </div>

                {/* Expanded content */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-7"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(16px)",
                    transition:
                      "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s",
                    pointerEvents: isHovered ? "auto" : "none",
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
                          onMouseEnter={() =>
                            setHoveredPlan(`preview-${plan.id}`)
                          }
                          onMouseLeave={() => setHoveredPlan(null)}
                          className="flex justify-between items-center rounded-lg px-3 py-2.5 cursor-pointer transition-all"
                          style={{
                            background:
                              hoveredPlan === `preview-${plan.id}`
                                ? "rgba(255,255,255,0.14)"
                                : "rgba(255,255,255,0.07)",
                            border:
                              hoveredPlan === `preview-${plan.id}`
                                ? `0.5px solid ${goal.accent}60`
                                : "0.5px solid rgba(255,255,255,0.12)",
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
                    onClick={() => navigate(`/plans/goal/${goal.key}`)}
                    className="flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all"
                    style={{ background: goal.accent, color: "#1a1a1a" }}
                  >
                    View all plans <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
              onClick={() => navigate(`/plans/${user.username}`)}
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
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/generate")}
                  size="sm"
                  className="gap-2"
                  style={{ background: "#c8a97e", color: "#1a1a1a" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Generate with AI
                </Button>
                <Button
                  onClick={() => navigate("/plans/new")}
                  size="sm"
                  variant="outline"
                  className="border-white/15 text-white/50 hover:bg-white/5 bg-transparent"
                >
                  Create manually
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
