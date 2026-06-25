import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Check,
  ArrowLeft,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GOALS = [
  { key: "MUSCLE_GAIN", label: "Muscle Gain", accent: "#c8a97e" },
  { key: "FAT_LOSS", label: "Fat Loss", accent: "#e07b54" },
  { key: "STRENGTH", label: "Strength", accent: "#7eb8d4" },
  { key: "ENDURANCE", label: "Endurance", accent: "#84c98a" },
  { key: "FLEXIBILITY", label: "Flexibility", accent: "#b48fd4" },
  { key: "GENERAL_FITNESS", label: "General Fitness", accent: "#d4b84a" },
];

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const ACTIVE = "#c8f135";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">
      {children}
    </p>
  );
}

function SelectButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer hover:opacity-90"
      style={{
        background: selected ? `${ACTIVE}10` : "rgba(255,255,255,0.04)",
        border: selected
          ? `1px solid ${ACTIVE}`
          : "1px solid rgba(255,255,255,0.12)",
        color: selected ? ACTIVE : "rgba(248,244,238,0.55)",
      }}
    >
      <span
        className="w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{
          border: selected
            ? `1.5px solid ${ACTIVE}`
            : "1.5px solid rgba(255,255,255,0.2)",
          background: selected ? `${ACTIVE}20` : "transparent",
        }}
      >
        {selected && (
          <Check
            className="w-2.5 h-2.5"
            style={{ color: ACTIVE }}
            strokeWidth={3}
          />
        )}
      </span>
      {label}
    </button>
  );
}

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

  const fetchExercises = async () => {
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
    fetchExercises();
  }, [muscleGroup]);

  useEffect(() => {
    const t = setTimeout(fetchExercises, 350);
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
          <h3 className="text-[#f8f4ee] font-semibold text-base">
            Add exercise
          </h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
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
                className="text-[10px] px-2.5 py-1 rounded-full transition-all cursor-pointer hover:opacity-90"
                style={{
                  background:
                    muscleGroup === mg
                      ? "rgba(200,241,53,0.12)"
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

        {/* Exercise list */}
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
                    <p className="text-[#f8f4ee] text-sm font-medium truncate group-hover:text-white transition-colors">
                      {ex.name}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {ex.muscleGroup} · {ex.equipmentType} ·{" "}
                      {ex.difficultyLevel}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-white/20 group-hover:text-white/60 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ ex, onChange, onRemove }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-white/15 flex-shrink-0" />
          <div>
            <p className="text-[#f8f4ee] text-sm font-medium">
              {ex.exerciseName}
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">
              {ex.muscleGroup} · {ex.equipmentType}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Sets", key: "sets", type: "number", min: 1 },
          { label: "Reps", key: "reps", type: "number", min: 1 },
          {
            label: "Weight (kg)",
            key: "weightKg",
            type: "number",
            min: 0,
            step: 0.5,
          },
          { label: "Rest (s)", key: "restSeconds", type: "number", min: 0 },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-[10px] text-white/30 block mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              min={field.min}
              step={field.step || 1}
              value={ex[field.key]}
              onChange={(e) =>
                onChange(
                  field.key,
                  field.type === "number"
                    ? parseFloat(e.target.value) || 0
                    : e.target.value,
                )
              }
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f8f4ee] focus:outline-none focus:border-white/25 text-center"
            />
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Notes (optional)..."
        value={ex.notes}
        onChange={(e) => onChange("notes", e.target.value)}
        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-[#f8f4ee] placeholder:text-white/20 focus:outline-none focus:border-white/20"
      />
    </div>
  );
}

function DayCard({ day, dayIndex, onUpdate, onRemove, onAddExercise }) {
  const [collapsed, setCollapsed] = useState(false);

  const updateExercise = (exTempId, key, value) => {
    onUpdate({
      ...day,
      exercises: day.exercises.map((ex) =>
        ex.tempId === exTempId ? { ...ex, [key]: value } : ex,
      ),
    });
  };

  const removeExercise = (exTempId) => {
    onUpdate({
      ...day,
      exercises: day.exercises.filter((ex) => ex.tempId !== exTempId),
    });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "0.5px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: `${ACTIVE}15`, color: ACTIVE }}
        >
          {dayIndex + 1}
        </div>
        <input
          type="text"
          placeholder={`Day ${dayIndex + 1} name (e.g. Push Day)`}
          value={day.name}
          onChange={(e) => onUpdate({ ...day, name: e.target.value })}
          className="flex-1 bg-transparent text-[#f8f4ee] text-sm font-medium placeholder:text-white/20 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25">
            {day.exercises.length} exercises
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="text-white/25 hover:text-white/60 transition-colors"
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
        <div className="px-4 pb-4 flex flex-col gap-3">
          {day.exercises.map((ex) => (
            <ExerciseRow
              key={ex.tempId}
              ex={ex}
              onChange={(key, val) => updateExercise(ex.tempId, key, val)}
              onRemove={() => removeExercise(ex.tempId)}
            />
          ))}

          <button
            type="button"
            onClick={() => onAddExercise(day.tempId)}
            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl transition-all w-full justify-center cursor-pointer hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px dashed rgba(255,255,255,0.12)",
              color: "rgba(248,244,238,0.35)",
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add exercise
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreatePlan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickerForDay, setPickerForDay] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    experienceLevel: "",
    days: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Plan name is required";
    if (!form.goal) e.goal = "Select a goal";
    if (!form.experienceLevel) e.experienceLevel = "Select experience level";
    if (form.days.length === 0) e.days = "Add at least one workout day";
    form.days.forEach((day, i) => {
      if (!day.name.trim())
        e[`day-${day.tempId}`] = `Day ${i + 1} needs a name`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addDay = () => {
    if (form.days.length >= 7) {
      toast.error("Maximum 7 days per week");
      return;
    }
    setForm((f) => ({
      ...f,
      days: [...f.days, { tempId: uid(), name: "", exercises: [] }],
    }));
  };

  const updateDay = (tempId, updated) => {
    setForm((f) => ({
      ...f,
      days: f.days.map((d) => (d.tempId === tempId ? updated : d)),
    }));
  };

  const removeDay = (tempId) => {
    setForm((f) => ({ ...f, days: f.days.filter((d) => d.tempId !== tempId) }));
  };

  const handleExerciseSelect = (exercise) => {
    const newEx = {
      tempId: uid(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipmentType: exercise.equipmentType,
      sets: 3,
      reps: 10,
      weightKg: 0,
      restSeconds: 60,
      notes: "",
      orderIndex: 0,
    };
    setForm((f) => ({
      ...f,
      days: f.days.map((d) =>
        d.tempId === pickerForDay
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                { ...newEx, orderIndex: d.exercises.length + 1 },
              ],
            }
          : d,
      ),
    }));
    setPickerForDay(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        goal: form.goal,
        experienceLevel: form.experienceLevel,
        days: form.days.map((day, di) => ({
          dayNumber: di + 1,
          name: day.name,
          exercises: day.exercises.map((ex, ei) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weightKg: ex.weightKg,
            restSeconds: ex.restSeconds,
            notes: ex.notes,
            orderIndex: ei + 1,
          })),
        })),
      };
      const res = await axiosInstance.post("/plans", payload);
      toast.success("Plan created!");
      navigate(`/plans/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {pickerForDay && (
        <ExercisePickerModal
          onSelect={handleExerciseSelect}
          onClose={() => setPickerForDay(null)}
        />
      )}

      <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/plans")}
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </button>

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Training programs
            </p>
            <h1 className="text-4xl font-bold text-[#f8f4ee] leading-tight">
              Create plan
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <SectionLabel>Plan name *</SectionLabel>
              <input
                type="text"
                placeholder="e.g. My Push Pull Legs"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                className="w-full bg-white/[0.04] border rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none transition-colors"
                style={{
                  borderColor: errors.name
                    ? "#ef4444"
                    : "rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.name
                    ? "#ef4444"
                    : "rgba(255,255,255,0.1)")
                }
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <SectionLabel>Description</SectionLabel>
              <textarea
                placeholder="Describe your plan — goals, structure, who it's for..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none resize-none"
                onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div>
              <SectionLabel>Fitness goal *</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <SelectButton
                    key={g.key}
                    label={g.label}
                    selected={form.goal === g.key}
                    onClick={() => {
                      setForm({ ...form, goal: g.key });
                      if (errors.goal) setErrors({ ...errors, goal: null });
                    }}
                  />
                ))}
              </div>
              {errors.goal && (
                <p className="text-xs text-red-400 mt-2">{errors.goal}</p>
              )}
            </div>

            <div>
              <SectionLabel>Experience level *</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <SelectButton
                    key={l}
                    label={l.charAt(0) + l.slice(1).toLowerCase()}
                    selected={form.experienceLevel === l}
                    onClick={() => {
                      setForm({ ...form, experienceLevel: l });
                      if (errors.experienceLevel)
                        setErrors({ ...errors, experienceLevel: null });
                    }}
                  />
                ))}
              </div>
              {errors.experienceLevel && (
                <p className="text-xs text-red-400 mt-2">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div className="border-t border-white/[0.06]" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Workout days *</SectionLabel>
                <span className="text-[10px] text-white/25">
                  {form.days.length}/7 days
                </span>
              </div>

              {errors.days && (
                <p className="text-xs text-red-400 mb-3">{errors.days}</p>
              )}

              <div className="flex flex-col gap-3">
                {form.days.map((day, index) => (
                  <div key={day.tempId}>
                    <DayCard
                      day={day}
                      dayIndex={index}
                      onUpdate={(updated) => updateDay(day.tempId, updated)}
                      onRemove={() => removeDay(day.tempId)}
                      onAddExercise={(dayTempId) => setPickerForDay(dayTempId)}
                    />
                    {errors[`day-${day.tempId}`] && (
                      <p className="text-xs text-red-400 mt-1.5 ml-1">
                        {errors[`day-${day.tempId}`]}
                      </p>
                    )}
                  </div>
                ))}

                {form.days.length < 7 && (
                  <button
                    type="button"
                    onClick={addDay}
                    className="flex items-center justify-center gap-2 text-sm py-4 rounded-2xl transition-all cursor-pointer hover:opacity-90"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "0.5px dashed rgba(255,255,255,0.1)",
                      color: "rgba(248,244,238,0.3)",
                    }}
                  >
                    <Plus className="w-4 h-4" /> Add workout day
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 px-8"
                style={{ background: ACTIVE, color: "#1a1a1a" }}
              >
                {loading ? "Creating..." : "Create plan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/plans")}
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
