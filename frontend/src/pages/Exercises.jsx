import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import { Search, Plus, Dumbbell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Exercise from "../components/Exercise";
import cover from "../assets/cover.jpg";

const MUSCLE_GROUPS = [
  "ALL",
  "CHEST",
  "BACK",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "LEGS",
  "GLUTES",
  "HAMSTRINGS",
  "QUADS",
  "CORE",
  "CARDIO",
  "FULL_BODY",
];

const EQUIPMENT_TYPES = [
  "ALL",
  "BARBELL",
  "DUMBBELL",
  "MACHINE",
  "CABLE",
  "BODYWEIGHT",
  "RESISTANCE_BAND",
  "KETTLEBELL",
  "OTHER",
];

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function Exercises() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("ALL");
  const [equipment, setEquipment] = useState("ALL");
  const [level, setLevel] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("pageNum", page);
      params.append("pageSize", 12);
      if (search) params.append("name", search);
      if (muscleGroup !== "ALL") params.append("muscleGroup", muscleGroup);
      if (equipment !== "ALL") params.append("equipmentType", equipment);
      if (level !== "ALL") params.append("difficultyLevel", level);

      const res = await axiosInstance.get(`/exercises?${params}`);
      setExercises(res.data.content);
      setTotalPages(res.data.page.totalPages);
      console.log(res.data);
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [page, muscleGroup, equipment, level]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchExercises();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-black/80 pb-16">
      {/* Header row */}
      <div className="min-h-[300px] px-32 py-6 relative overflow-hidden mb-8 flex items-end justify-between rounded-t-xl">
        <img
          src={cover}
          className="absolute inset-0 w-full h-full object-cover opacity-15 rounded-t-md"
        />

        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-[#f8f4ee]">Exercises</h1>
          <p className="text-sm text-white/40 mt-1">
            Browse the exercise library{user ? " or create your own" : ""}
          </p>
        </div>
        {user && (
          <div className="relative z-10">
            <Button
              onClick={() => navigate("/exercises/new")}
              className="gap-2 bg-[#f8f4ee] text-[#252525] hover:bg-[#e4ddcc]"
            >
              <Plus className="w-4 h-4" />
              Add exercise
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 lg:px-12">
        {/* Search + filters */}
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-[#f8f4ee] placeholder:text-white/30 focus:outline-none focus:border-white/25"
              />
            </div>
            <select
              value={equipment}
              onChange={(e) => {
                setEquipment(e.target.value);
                setPage(0);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-white/25"
            >
              {EQUIPMENT_TYPES.map((e) => (
                <option key={e} value={e} className="bg-[#252525]">
                  {e === "ALL" ? "All equipment" : e}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(0);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-white/25"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l} className="bg-[#252525]">
                  {l === "ALL" ? "All levels" : l}
                </option>
              ))}
            </select>
          </div>

          {/* Muscle group pills */}
          <div className="flex gap-2 flex-wrap mt-2">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                onClick={() => {
                  setMuscleGroup(mg);
                  setPage(0);
                }}
                className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  muscleGroup === mg
                    ? "bg-white text-black font-medium"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/60"
                }`}
              >
                {mg === "ALL"
                  ? "All"
                  : mg.charAt(0) + mg.slice(1).toLowerCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto mt-18">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/30">
              <Dumbbell className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No exercises found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-22 gap-x-1 bg-black p-10 border border-primary rounded-xl">
                {exercises.map((exercise) => {
                  // console.log(exercise);
                  return <Exercise key={exercise.id} exercise={exercise} />;
                })}
                {user && (
                  <div
                    onClick={() => navigate("/exercises/new")}
                    className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center h-full min-h-[180px] cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all gap-2"
                  >
                    <Plus className="w-6 h-6 text-white/20" />
                    <span className="text-xs text-white/25">
                      Create exercise
                    </span>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-sm px-4 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  <span className="text-sm text-white/30">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sm px-4 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
