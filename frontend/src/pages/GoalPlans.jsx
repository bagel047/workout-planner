import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import { Sparkles, Search, Dumbbell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanCard from "../components/PlanCard.jsx";

import muscleImg from "../assets/goals/muscle.jpg";
import fatLossImg from "../assets/goals/fatloss.jpg";
import strengthImg from "../assets/goals/strength.jpg";
import enduranceImg from "../assets/goals/endurance.jpg";
import flexibilityImg from "../assets/goals/flexibility.jpg";
import generalImg from "../assets/goals/generalfitness.jpg";

const GOAL_META = {
  MUSCLE_GAIN: {
    label: "Muscle Gain",
    accent: "#c8a97e",
    image: muscleImg,
    tagline: "Build size and strength",
  },
  FAT_LOSS: {
    label: "Fat Loss",
    accent: "#e07b54",
    image: fatLossImg,
    tagline: "Burn fat, stay lean",
  },
  STRENGTH: {
    label: "Strength",
    accent: "#7eb8d4",
    image: strengthImg,
    tagline: "Lift heavier, get stronger",
  },
  ENDURANCE: {
    label: "Endurance",
    accent: "#84c98a",
    image: enduranceImg,
    tagline: "Go further, last longer",
  },
  FLEXIBILITY: {
    label: "Flexibility",
    accent: "#b48fd4",
    image: flexibilityImg,
    tagline: "Move freely, recover faster",
  },
  GENERAL_FITNESS: {
    label: "General Fitness",
    accent: "#d4b84a",
    image: generalImg,
    tagline: "Move well, feel great",
  },
};

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function GoalPlans() {
  const { goalKey } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const meta = GOAL_META[goalKey] || {
    label: goalKey,
    accent: "#888",
    image: null,
    tagline: "",
  };

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("ALL");
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("goal", goalKey);
      params.append("pageNum", page);
      params.append("pageSize", 12);
      if (search) params.append("name", search);
      if (level !== "ALL") params.append("experienceLevel", level);

      const res = await axiosInstance.get(`/plans?${params}`);
      setPlans(res.data.content);
      setTotalPages(res.data.page?.totalPages ?? res.data.totalPages ?? 0);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, level, goalKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchPlans();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="relative h-72 overflow-hidden">
        {meta.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${meta.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.3) 60%, transparent 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: `linear-gradient(to top, ${meta.accent}18 0%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-24 max-w-7xl mx-auto pt-28 pb-8">
          <button
            onClick={() => navigate("/plans")}
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> All goals
          </button>
          <div className="flex items-end justify-between">
            <div>
              <span
                className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                style={{
                  background: `${meta.accent}20`,
                  color: meta.accent,
                  border: `0.5px solid ${meta.accent}40`,
                }}
              >
                {meta.label}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-[#f8f4ee] leading-tight">
                {meta.tagline}
              </h1>
            </div>
            {user && (
              <Button
                onClick={() => navigate("/generate")}
                size="sm"
                className="gap-2 hidden lg:flex"
                style={{ background: meta.accent, color: "#1a1a1a" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate with AI
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-24 max-w-7xl mx-auto pt-8 pb-28">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={`Search ${meta.label} plans...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(0);
            }}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/60 focus:outline-none"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l} className="bg-zinc-900">
                {l === "ALL"
                  ? "All levels"
                  : l.charAt(0) + l.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div
              className="w-8 h-8 border-2 border-white/15 rounded-full animate-spin"
              style={{ borderTopColor: meta.accent }}
            />
          </div>
        ) : plans.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
            <Dumbbell className="w-10 h-10 text-white/10" />
            <p className="text-white/30 text-sm">No {meta.label} plans found</p>
            {user && (
              <Button
                onClick={() => navigate("/generate")}
                size="sm"
                className="gap-2"
                style={{ background: meta.accent, color: "#1a1a1a" }}
              >
                <Sparkles className="w-3 h-3" /> Generate one with AI
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm px-4 py-2 rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
            >
              ← Prev
            </button>
            <span className="text-sm text-white/30">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm px-4 py-2 rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
