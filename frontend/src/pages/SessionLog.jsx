import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Dumbbell,
  Check,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const ACTIVE = "#c8f135";

function ExercisePickerModal({ onSelect, onClose }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("ALL");

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
    "FULL_BODY",
    "CARDIO",
  ];

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("pageNum", 0);
      params.append("pageSize", 50);
      if (search) params.append("name", search);
      if (muscleGroup !== "ALL") params.append("muscleGroup", muscleGroup);
      const res = await axiosInstance.get(`/exercises?${params}`);
      setExercises(res.data.content);
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [muscleGroup]);
  useEffect(() => {
    const t = setTimeout(fetch, 350);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: "#1c1c1e",
          border: "0.5px solid rgba(255,255,255,0.12)",
          maxHeight: "80vh",
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="text-[#f8f4ee] font-semibold">Add exercise</h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-white/[0.07]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              autoFocus
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleGroup(mg)}
                className="text-[10px] px-2.5 py-1 rounded-full transition-all"
                style={{
                  background:
                    muscleGroup === mg
                      ? `${ACTIVE}12`
                      : "rgba(255,255,255,0.05)",
                  border:
                    muscleGroup === mg
                      ? `0.5px solid ${ACTIVE}`
                      : "0.5px solid rgba(255,255,255,0.1)",
                  color: muscleGroup === mg ? ACTIVE : "rgba(248,244,238,0.4)",
                }}
              >
                {mg === "ALL"
                  ? "All"
                  : mg.charAt(0) + mg.slice(1).toLowerCase().replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
            </div>
          ) : exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Dumbbell className="w-8 h-8 text-white/10" />
              <p className="text-white/25 text-sm">No exercises found</p>
            </div>
          ) : (
            <div className="p-2">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all hover:bg-white/[0.06] group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <Dumbbell className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f8f4ee] text-sm font-medium truncate group-hover:text-white">
                      {ex.name}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {ex.muscleGroup} · {ex.equipmentType}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-white/20 group-hover:text-white/60 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanDayPickerModal({ onSelect, onClose }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/plans?pageNum=0&pageSize=50");
        setPlans(res.data.content);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: "#1c1c1e",
          border: "0.5px solid rgba(255,255,255,0.12)",
          maxHeight: "80vh",
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="text-[#f8f4ee] font-semibold">Choose a workout day</h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <p className="text-white/25 text-sm text-center py-8">
              No plans found
            </p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="mb-2">
                <button
                  onClick={() =>
                    setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-white/[0.06]"
                  style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-left">
                    <p className="text-[#f8f4ee] text-sm font-medium">
                      {plan.name}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {plan.daysPerWeek} days · {plan.goal?.replace(/_/g, " ")}
                    </p>
                  </div>
                  {expandedPlan === plan.id ? (
                    <ChevronUp className="w-4 h-4 text-white/30" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  )}
                </button>
                {expandedPlan === plan.id && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {plan.days?.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => onSelect(plan, day)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg transition-all hover:bg-white/[0.08] text-left"
                        style={{
                          border: "0.5px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div>
                          <p className="text-[#f8f4ee] text-xs font-medium">
                            {day.name}
                          </p>
                          <p className="text-white/25 text-[10px]">
                            {day.exercises?.length ?? 0} exercises
                          </p>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-white/30" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SetRow({ set, index, onChange, onRemove, planned }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/25 w-5 text-center flex-shrink-0">
        {index + 1}
      </span>
      {planned && (
        <div className="flex gap-1 text-[10px] text-white/20 flex-shrink-0 min-w-[80px]">
          <span>
            {planned.sets}×{planned.reps}
          </span>
          {planned.weightKg > 0 && <span>@ {planned.weightKg}kg</span>}
        </div>
      )}
      <input
        type="number"
        min={0}
        placeholder="Reps"
        value={set.repsCompleted}
        onChange={(e) =>
          onChange("repsCompleted", parseInt(e.target.value) || 0)
        }
        className="w-16 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[#f8f4ee] text-center focus:outline-none focus:border-white/25"
      />
      <input
        type="number"
        min={0}
        step={0.5}
        placeholder="kg"
        value={set.weightKg}
        onChange={(e) => onChange("weightKg", parseFloat(e.target.value) || 0)}
        className="w-16 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[#f8f4ee] text-center focus:outline-none focus:border-white/25"
      />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange("rpe", r)}
            className="w-5 h-5 rounded text-[9px] font-bold transition-all flex-shrink-0"
            style={{
              background: set.rpe === r ? ACTIVE : "rgba(255,255,255,0.06)",
              color: set.rpe === r ? "#1a1a1a" : "rgba(248,244,238,0.3)",
            }}
          >
            {r}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-white/15 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ExerciseBlock({ entry, onUpdate, onRemove }) {
  const [collapsed, setCollapsed] = useState(false);

  const addSet = () => {
    const lastSet = entry.sets[entry.sets.length - 1];
    onUpdate({
      ...entry,
      sets: [
        ...entry.sets,
        {
          tempId: uid(),
          repsCompleted: lastSet?.repsCompleted || entry.plannedReps || 0,
          weightKg: lastSet?.weightKg || entry.plannedWeight || 0,
          rpe: null,
        },
      ],
    });
  };

  const updateSet = (tempId, key, val) => {
    onUpdate({
      ...entry,
      sets: entry.sets.map((s) =>
        s.tempId === tempId ? { ...s, [key]: val } : s,
      ),
    });
  };

  const removeSet = (tempId) => {
    onUpdate({ ...entry, sets: entry.sets.filter((s) => s.tempId !== tempId) });
  };

  const planned = entry.plannedSets
    ? {
        sets: entry.plannedSets,
        reps: entry.plannedReps,
        weightKg: entry.plannedWeight,
      }
    : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <Dumbbell className="w-4 h-4 text-white/30" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#f8f4ee] text-sm font-medium truncate">
            {entry.exerciseName}
          </p>
          {planned && (
            <p className="text-white/25 text-[10px] mt-0.5">
              Planned: {planned.sets}×{planned.reps}
              {planned.weightKg > 0 ? ` @ ${planned.weightKg}kg` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25">
            {entry.sets.length} sets
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="text-white/25 hover:text-white/60"
          >
            {collapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          {planned && (
            <div className="flex gap-2 text-[10px] text-white/30 mb-1 pl-5">
              <span className="w-5" />
              {planned && <span className="min-w-[80px]">Planned</span>}
              <span className="w-16 text-center">Reps</span>
              <span className="w-16 text-center">Weight</span>
              <span>RPE (1-10)</span>
            </div>
          )}
          {entry.sets.map((set, i) => (
            <SetRow
              key={set.tempId}
              set={set}
              index={i}
              planned={planned}
              onChange={(key, val) => updateSet(set.tempId, key, val)}
              onRemove={() => removeSet(set.tempId)}
            />
          ))}
          <button
            type="button"
            onClick={addSet}
            className="flex items-center gap-2 text-xs py-2 rounded-lg transition-all mt-1 justify-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px dashed rgba(255,255,255,0.1)",
              color: "rgba(248,244,238,0.3)",
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add set
          </button>
        </div>
      )}
    </div>
  );
}

export default function SessionLog() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | "free" | "plan"
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState({
    date: new Date().toISOString().split("T")[0],
    durationMinutes: "",
    notes: "",
    workoutDayId: null,
    exercises: [],
  });

  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [selectedDayName, setSelectedDayName] = useState("");

  const handlePlanDaySelect = (plan, day) => {
    setSelectedPlanName(plan.name);
    setSelectedDayName(day.name);
    const prefilled =
      day.exercises?.map((ex) => ({
        tempId: uid(),
        exerciseId: ex.exercise.id,
        exerciseName: ex.exercise.name,
        muscleGroup: ex.exercise.muscleGroup,
        workoutExerciseId: ex.id,
        plannedSets: ex.sets,
        plannedReps: ex.reps,
        plannedWeight: ex.weightKg,
        sets: Array.from({ length: ex.sets }, () => ({
          tempId: uid(),
          repsCompleted: ex.reps,
          weightKg: ex.weightKg || 0,
          rpe: null,
        })),
      })) || [];

    setSession((s) => ({ ...s, workoutDayId: day.id, exercises: prefilled }));
    setShowPlanPicker(false);
    setMode("plan");
  };

  const handleExerciseSelect = (ex) => {
    setSession((s) => ({
      ...s,
      exercises: [
        ...s.exercises,
        {
          tempId: uid(),
          exerciseId: ex.id,
          exerciseName: ex.name,
          muscleGroup: ex.muscleGroup,
          workoutExerciseId: null,
          plannedSets: null,
          plannedReps: null,
          plannedWeight: null,
          sets: [
            {
              tempId: uid(),
              repsCompleted: 0,
              weightKg: 0,
              rpe: null,
            },
          ],
        },
      ],
    }));
    setShowExercisePicker(false);
  };

  const updateExercise = (tempId, updated) => {
    setSession((s) => ({
      ...s,
      exercises: s.exercises.map((e) => (e.tempId === tempId ? updated : e)),
    }));
  };

  const removeExercise = (tempId) => {
    setSession((s) => ({
      ...s,
      exercises: s.exercises.filter((e) => e.tempId !== tempId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (session.exercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        date: session.date,
        durationMinutes: session.durationMinutes
          ? parseInt(session.durationMinutes)
          : null,
        notes: session.notes || null,
        workoutDayId: session.workoutDayId,
        sets: session.exercises.flatMap((ex) =>
          ex.sets.map((set) => ({
            exerciseId: ex.exerciseId,
            workoutExerciseId: ex.workoutExerciseId,
            repsCompleted: set.repsCompleted,
            weightKg: set.weightKg,
            rpe: set.rpe,
          })),
        ),
      };
      const res = await axiosInstance.post("/sessions", payload);
      toast.success("Session logged!");
      navigate(`/sessions/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log session");
    } finally {
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate("/sessions")}
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Training log
            </p>
            <h1 className="text-4xl font-bold text-[#f8f4ee] leading-tight">
              Log a session
            </h1>
            <p className="text-white/35 text-sm mt-3">
              Are you following a plan today or training freely?
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setShowPlanPicker(true);
              }}
              className="flex items-start gap-4 p-6 rounded-2xl text-left transition-all group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${ACTIVE}15`,
                  border: `0.5px solid ${ACTIVE}30`,
                }}
              >
                <Check className="w-5 h-5" style={{ color: ACTIVE }} />
              </div>
              <div>
                <p className="text-[#f8f4ee] font-semibold mb-1 group-hover:text-white transition-colors">
                  Follow a plan
                </p>
                <p className="text-white/35 text-sm leading-relaxed">
                  Pick a workout day from one of your plans. Sets and exercises
                  will be pre-filled.
                </p>
              </div>
            </button>
            <button
              onClick={() => setMode("free")}
              className="flex items-start gap-4 p-6 rounded-2xl text-left transition-all group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
              >
                <Zap className="w-5 h-5 text-white/40" />
              </div>
              <div>
                <p className="text-[#f8f4ee] font-semibold mb-1 group-hover:text-white transition-colors">
                  Free session
                </p>
                <p className="text-white/35 text-sm leading-relaxed">
                  Log whatever you did. Add exercises freely and track your
                  sets.
                </p>
              </div>
            </button>
          </div>
        </div>
        {showPlanPicker && (
          <PlanDayPickerModal
            onSelect={handlePlanDaySelect}
            onClose={() => setShowPlanPicker(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {showExercisePicker && (
        <ExercisePickerModal
          onSelect={handleExerciseSelect}
          onClose={() => setShowExercisePicker(false)}
        />
      )}

      <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setMode(null)}
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Change mode
          </button>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Training log
            </p>
            <h1 className="text-3xl font-bold text-[#f8f4ee] leading-tight">
              {mode === "plan"
                ? selectedDayName || "Plan session"
                : "Free session"}
            </h1>
            {mode === "plan" && selectedPlanName && (
              <p className="text-white/35 text-sm mt-1">{selectedPlanName}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="date"
                    value={session.date}
                    onChange={(e) =>
                      setSession((s) => ({ ...s, date: e.target.value }))
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#f8f4ee] focus:outline-none focus:border-white/25"
                  />
                </div>
              </div>
              <div className="w-36">
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 60"
                  value={session.durationMinutes}
                  onChange={(e) =>
                    setSession((s) => ({
                      ...s,
                      durationMinutes: e.target.value,
                    }))
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f8f4ee] focus:outline-none focus:border-white/25 text-center"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] uppercase tracking-widest text-white/30">
                  Exercises
                </label>
                <span className="text-[10px] text-white/20">
                  {session.exercises.length} added
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {session.exercises.map((ex) => (
                  <ExerciseBlock
                    key={ex.tempId}
                    entry={ex}
                    onUpdate={(updated) => updateExercise(ex.tempId, updated)}
                    onRemove={() => removeExercise(ex.tempId)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setShowExercisePicker(true)}
                  className="flex items-center justify-center gap-2 text-sm py-4 rounded-2xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px dashed rgba(255,255,255,0.1)",
                    color: "rgba(248,244,238,0.3)",
                  }}
                >
                  <Plus className="w-4 h-4" /> Add exercise
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">
                Notes
              </label>
              <textarea
                placeholder="How did the session feel? Any PRs?"
                value={session.notes}
                onChange={(e) =>
                  setSession((s) => ({ ...s, notes: e.target.value }))
                }
                rows={2}
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/20 focus:outline-none resize-none"
                onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div className="border-t border-white/[0.06]" />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 px-8"
                style={{
                  background: loading ? `${ACTIVE}60` : ACTIVE,
                  color: "#1a1a1a",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />{" "}
                    Saving...
                  </>
                ) : (
                  "Save session"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/sessions")}
                className="border-white/15 text-white/50 hover:bg-white/5 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
