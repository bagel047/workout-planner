import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import { Sparkles, Plus, Search, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanCard from "../components/PlanCard.jsx";
import bgImage from "../assets/1bg.jpg";

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
const GOALS = [
  { key: "ALL", label: "All goals" },
  { key: "MUSCLE_GAIN", label: "Muscle Gain" },
  { key: "FAT_LOSS", label: "Fat Loss" },
  { key: "STRENGTH", label: "Strength" },
  { key: "ENDURANCE", label: "Endurance" },
  { key: "FLEXIBILITY", label: "Flexibility" },
  { key: "GENERAL_FITNESS", label: "General Fitness" },
];
const SOURCES = ["ALL", "USER", "SYSTEM", "AI"];

export default function UserPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPlans, setMyPlans] = useState([]);
  const [myPlansLoading, setMyPlansLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("ALL");
  const [goal, setGoal] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const fetchMyPlans = async () => {
    setMyPlansLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("pageNum", page);
      params.append("pageSize", 12);
      if (search) params.append("name", search);
      if (level !== "ALL") params.append("experienceLevel", level);
      if (goal !== "ALL") params.append("goal", goal);
      if (source != "ALL") {
        if (source == "USER") {
          params.append("source", source);
          params.append("isAiGenerated", false);
        }
        if (source == "AI") {
          params.append("source", "USER");
          params.append("isAiGenerated", true);
        } else {
          params.append("source", source);
        }
      }

      const res = await axiosInstance.get(`/plans?${params}`);
      setMyPlans(res.data.content);
      setTotalPages(res.data.page?.totalPages ?? res.data.totalPages ?? 0);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setMyPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlans();
  }, [page, level, goal, source]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchMyPlans();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner */}
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="relative z-10 h-full flex items-end px-6 lg:px-24 pb-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between w-full pt-24">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/35 mb-2">
                Your training
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#f8f4ee]">
                My Plans
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/generate")}
                size="sm"
                className="gap-2"
                style={{ background: "#c8a97e", color: "#1a1a1a" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Generate
              </Button>
              <Button
                onClick={() => navigate("/plans/new")}
                size="sm"
                variant="outline"
                className="gap-2 border-white/20 text-white/60 hover:bg-white/8 hover:text-white bg-transparent"
              >
                <Plus className="w-3.5 h-3.5" /> Create plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-24 max-w-7xl mx-auto pt-8 pb-28">
        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search your plans..."
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
              className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-white/25"
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

          {/* Goal pills */}
          <div className="flex gap-2 flex-wrap">
            {GOALS.map((g) => (
              <button
                key={g.key}
                onClick={() => {
                  setGoal(g.key);
                  setPage(0);
                }}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background:
                    goal === g.key
                      ? "rgba(200,169,126,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    goal === g.key
                      ? "0.5px solid #c8a97e"
                      : "0.5px solid rgba(255,255,255,0.1)",
                  color: goal === g.key ? "#c8a97e" : "rgba(248,244,238,0.4)",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Source pills */}
          <div className="flex gap-2 flex-wrap">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSource(s);
                  setPage(0);
                }}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background:
                    source === s
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    source === s
                      ? "0.5px solid rgba(255,255,255,0.4)"
                      : "0.5px solid rgba(255,255,255,0.08)",
                  color:
                    source === s
                      ? "rgba(248,244,238,0.9)"
                      : "rgba(248,244,238,0.35)",
                }}
              >
                {s === "ALL"
                  ? "All sources"
                  : s === "AI"
                    ? "✦ AI"
                    : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {myPlansLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white/15 border-t-[#c8a97e] rounded-full animate-spin" />
          </div>
        ) : myPlans.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
            <Dumbbell className="w-10 h-10 text-white/10" />
            <p className="text-white/30 text-sm">No plans found</p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/generate")}
                size="sm"
                className="gap-2"
                style={{ background: "#c8a97e", color: "#1a1a1a" }}
              >
                <Sparkles className="w-3 h-3" /> Generate with AI
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 mt-16">
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
