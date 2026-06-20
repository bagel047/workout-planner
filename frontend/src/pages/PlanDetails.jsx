import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Sparkles,
  Save,
  X,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import muscleImg from "../assets/goals/muscle.jpg";
import fatLossImg from "../assets/goals/fatloss.jpg";
import strengthImg from "../assets/goals/strength.jpg";
import enduranceImg from "../assets/goals/endurance.jpg";
import flexibilityImg from "../assets/goals/flexibility.jpg";
import generalImg from "../assets/goals/generalfitness.jpg";

const GOAL_META = {
  MUSCLE_GAIN: { label: "Muscle Gain", accent: "#c8a97e", image: muscleImg },
  FAT_LOSS: { label: "Fat Loss", accent: "#e07b54", image: fatLossImg },
  STRENGTH: { label: "Strength", accent: "#7eb8d4", image: strengthImg },
  ENDURANCE: { label: "Endurance", accent: "#84c98a", image: enduranceImg },
  FLEXIBILITY: {
    label: "Flexibility",
    accent: "#b48fd4",
    image: flexibilityImg,
  },
  GENERAL_FITNESS: {
    label: "General Fitness",
    accent: "#d4b84a",
    image: generalImg,
  },
};

const ACTIVE = "#c8f135";

function StatPill({ label, value }) {
  return (
    <div
      className="flex flex-col items-center px-5 py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
        {label}
      </span>
      <span className="text-[#f8f4ee] text-sm font-semibold">{value}</span>
    </div>
  );
}

function ExerciseRow({ ex, canEdit, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState({ ...ex });

  const handleSave = () => {
    onUpdate(local);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocal({ ...ex });
    setEditing(false);
  };

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: editing
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        border: editing
          ? `0.5px solid ${ACTIVE}40`
          : "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Dumbbell className="w-4 h-4 text-white/30" />
          </div>
          <div>
            <p className="text-[#f8f4ee] text-sm font-medium">
              {ex.exercise?.name}
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">
              {ex.exercise?.muscleGroup} · {ex.exercise?.equipmentType}
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-white/40 hover:text-green-400 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white/25 hover:text-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-white/20 hover:text-white/60 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onRemove}
                  className="text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Sets", key: "sets" },
            { label: "Reps", key: "reps" },
            { label: "Weight (kg)", key: "weightKg" },
            { label: "Rest (s)", key: "restSeconds" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[10px] text-white/30 block mb-1">
                {f.label}
              </label>
              <input
                type="number"
                min={0}
                value={local[f.key] ?? 0}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    [f.key]: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f8f4ee] focus:outline-none text-center"
                style={{ borderColor: ACTIVE + "40" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Sets", value: ex.sets },
            { label: "Reps", value: ex.reps },
            { label: "Weight", value: ex.weightKg ? `${ex.weightKg}kg` : "BW" },
            { label: "Rest", value: `${ex.restSeconds}s` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-[10px] text-white/25 mb-0.5">
                {s.label}
              </span>
              <span className="text-[#f8f4ee] text-xs font-semibold">
                {s.value}
              </span>
            </div>
          ))}
          {ex.notes && (
            <p className="w-full text-[10px] text-white/30 mt-1 italic">
              {ex.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DaySection({ day, canEdit, planId, onDayUpdated }) {
  const [open, setOpen] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(day.name);

  const saveName = async () => {
    try {
      await axiosInstance.put(`/plans/${planId}/days/${day.id}`, {
        dayNumber: day.dayNumber,
        name,
        exercises: day.exercises?.map((ex) => ({
          exerciseId: ex.exercise.id,
          sets: ex.sets,
          reps: ex.reps,
          weightKg: ex.weightKg,
          restSeconds: ex.restSeconds,
          orderIndex: ex.orderIndex,
          notes: ex.notes,
        })),
      });
      onDayUpdated();
      setEditingName(false);
      toast.success("Day updated");
    } catch {
      toast.error("Failed to update day");
    }
  };

  const updateExercise = async (ex, updated) => {
    try {
      await axiosInstance.put(
        `/plans/${planId}/days/${day.id}/exercises/${ex.id}`,
        {
          exerciseId: ex.exercise.id,
          sets: updated.sets,
          reps: updated.reps,
          weightKg: updated.weightKg,
          restSeconds: updated.restSeconds,
          orderIndex: ex.orderIndex,
          notes: updated.notes ?? ex.notes,
        },
      );
      onDayUpdated();
      toast.success("Exercise updated");
    } catch {
      toast.error("Failed to update exercise");
    }
  };

  const removeExercise = async (ex) => {
    try {
      await axiosInstance.delete(
        `/plans/${planId}/days/${day.id}/exercises/${ex.id}`,
      );
      onDayUpdated();
      toast.success("Exercise removed");
    } catch {
      toast.error("Failed to remove exercise");
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "0.5px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: `${ACTIVE}15`, color: ACTIVE }}
        >
          {day.dayNumber}
        </div>

        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-white/[0.06] border rounded-lg px-3 py-1.5 text-sm text-[#f8f4ee] focus:outline-none"
              style={{ borderColor: ACTIVE + "60" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") {
                  setEditingName(false);
                  setName(day.name);
                }
              }}
            />
            <button
              onClick={saveName}
              className="text-white/40 hover:text-green-400 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditingName(false);
                setName(day.name);
              }}
              className="text-white/25 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[#f8f4ee] text-sm font-medium">
              {day.name}
            </span>
            {canEdit && (
              <button
                onClick={() => setEditingName(true)}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25">
            {day.exercises?.length ?? 0} exercises
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-white/25 hover:text-white/60 transition-colors"
          >
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          {day.exercises?.length === 0 ? (
            <p className="text-white/20 text-xs text-center py-4">
              No exercises yet
            </p>
          ) : (
            day.exercises?.map((ex) => (
              <ExerciseRow
                key={ex.id}
                ex={ex}
                canEdit={canEdit}
                onUpdate={(updated) => updateExercise(ex, updated)}
                onRemove={() => removeExercise(ex)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaForm, setMetaForm] = useState({});
  const [savingMeta, setSavingMeta] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchPlan = async () => {
    try {
      const res = await axiosInstance.get(`/plans/${id}`);
      setPlan(res.data);
      setMetaForm({
        name: res.data.name,
        description: res.data.description,
        goal: res.data.goal,
        experienceLevel: res.data.experienceLevel,
      });
    } catch {
      toast.error("Failed to load plan");
      navigate("/plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(user);
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const canEdit =
    user &&
    plan &&
    plan.source !== "SYSTEM" &&
    plan.createdByUserId === user?.id;

  const saveMeta = async () => {
    setSavingMeta(true);
    try {
      await axiosInstance.put(`/plans/${id}`, {
        ...metaForm,
        days: plan.days?.map((day) => ({
          dayNumber: day.dayNumber,
          name: day.name,
          exercises: day.exercises?.map((ex) => ({
            exerciseId: ex.exercise.id,
            sets: ex.sets,
            reps: ex.reps,
            weightKg: ex.weightKg,
            restSeconds: ex.restSeconds,
            orderIndex: ex.orderIndex,
            notes: ex.notes,
          })),
        })),
      });
      await fetchPlan();
      setEditingMeta(false);
      toast.success("Plan updated");
    } catch {
      toast.error("Failed to update plan");
    } finally {
      setSavingMeta(false);
    }
  };

  const deletePlan = async () => {
    try {
      await axiosInstance.delete(`/plans/${id}`);
      toast.success("Plan deleted");
      navigate("/plans/mine");
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  const meta = GOAL_META[plan?.goal] || {
    label: plan?.goal,
    accent: "#888",
    image: null,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner */}
      <div className="relative h-72 overflow-hidden">
        {meta.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${meta.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.2) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: `linear-gradient(to top, ${meta.accent}15 0%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-24 max-w-5xl mx-auto pt-28 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: `${meta.accent}20`,
                    color: meta.accent,
                    border: `0.5px solid ${meta.accent}40`,
                  }}
                >
                  {meta.label}
                </span>
                {plan.isAiGenerated && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(138,92,246,0.25)",
                      color: "#d4bbff",
                      border: "0.5px solid rgba(138,92,246,0.3)",
                    }}
                  >
                    <Sparkles className="w-2.5 h-2.5" /> AI Generated
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#f8f4ee] leading-tight">
                {plan.name}
              </h1>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setEditingMeta(true)}
                  variant="outline"
                  className="gap-2 border-white/20 text-white/60 hover:bg-white/8 hover:text-white bg-transparent"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-24 max-w-5xl mx-auto pt-8 pb-24">
        <div className="flex gap-3 flex-wrap mb-10">
          <StatPill label="Days/week" value={`${plan.daysPerWeek} days`} />
          <StatPill
            label="Level"
            value={
              plan.experienceLevel?.charAt(0) +
              plan.experienceLevel?.slice(1).toLowerCase()
            }
          />
          <StatPill label="Source" value={plan.source} />
          <StatPill
            label="Total exercises"
            value={plan.days?.reduce(
              (acc, d) => acc + (d.exercises?.length ?? 0),
              0,
            )}
          />
        </div>

        {plan.description && (
          <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-xl">
            {plan.description}
          </p>
        )}

        {editingMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setEditingMeta(false)}
            />
            <div
              className="relative w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: "#1c1c1e",
                border: "0.5px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[#f8f4ee] font-semibold">
                  Edit plan details
                </h3>
                <button
                  onClick={() => setEditingMeta(false)}
                  className="text-white/30 hover:text-white/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">
                  Name
                </label>
                <input
                  value={metaForm.name}
                  onChange={(e) =>
                    setMetaForm({ ...metaForm, name: e.target.value })
                  }
                  className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f8f4ee] focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">
                  Description
                </label>
                <textarea
                  value={metaForm.description}
                  onChange={(e) =>
                    setMetaForm({ ...metaForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f8f4ee] focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={saveMeta}
                  disabled={savingMeta}
                  className="flex-1 gap-2"
                  style={{ background: ACTIVE, color: "#1a1a1a" }}
                >
                  <Save className="w-4 h-4" />
                  {savingMeta ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  onClick={() => setEditingMeta(false)}
                  variant="outline"
                  className="border-white/15 text-white/50 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div
              className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 text-center"
              style={{
                background: "#1c1c1e",
                border: "0.5px solid rgba(239,68,68,0.3)",
              }}
            >
              <Trash2 className="w-8 h-8 text-red-400 mx-auto" />
              <div>
                <h3 className="text-[#f8f4ee] font-semibold text-base mb-1">
                  Delete this plan?
                </h3>
                <p className="text-white/40 text-sm">
                  This will permanently delete "{plan.name}" and all its days
                  and exercises.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={deletePlan}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
                >
                  Yes, delete
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 border-white/15 text-white/50 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {plan.days?.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
              <Dumbbell className="w-10 h-10 text-white/10" />
              <p className="text-white/25 text-sm">No workout days yet</p>
            </div>
          ) : (
            plan.days?.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                canEdit={canEdit}
                planId={id}
                onDayUpdated={fetchPlan}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
