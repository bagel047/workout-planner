import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MUSCLE_GROUPS = [
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

const EQUIPMENT_TYPES = [
  "BARBELL",
  "DUMBBELL",
  "MACHINE",
  "CABLE",
  "BODYWEIGHT",
  "RESISTANCE_BAND",
  "KETTLEBELL",
  "OTHER",
];

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const ACTIVE_COLOR = "#c8f135";

function SelectButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer hover:opacity-80"
      style={{
        background: selected ? `${ACTIVE_COLOR}10` : "rgba(255,255,255,0.04)",
        border: selected
          ? `1px solid ${ACTIVE_COLOR}`
          : "1px solid rgba(255,255,255,0.12)",
        color: selected ? ACTIVE_COLOR : "rgba(248,244,238,0.55)",
      }}
    >
      <span
        className="w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{
          border: selected
            ? `1.5px solid ${ACTIVE_COLOR}`
            : "1.5px solid rgba(255,255,255,0.2)",
          background: selected ? `${ACTIVE_COLOR}20` : "transparent",
        }}
      >
        {selected && (
          <Check
            className="w-2.5 h-2.5"
            style={{ color: ACTIVE_COLOR }}
            strokeWidth={3}
          />
        )}
      </span>
      {label.charAt(0) + label.slice(1).toLowerCase().replace(/_/g, " ")}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">
      {children}
    </p>
  );
}

export default function CreateExercise() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    videoUrl: "",
    muscleGroup: "",
    equipmentType: "",
    difficultyLevel: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.muscleGroup) e.muscleGroup = "Select a muscle group";
    if (!form.equipmentType) e.equipmentType = "Select equipment type";
    if (!form.difficultyLevel) e.difficultyLevel = "Select difficulty level";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/exercises", form);
      toast.success("Exercise created!");
      navigate(`/exercises`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create exercise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-24">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/exercises")}
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to exercises
        </button>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
            Exercise library
          </p>
          <h1 className="text-4xl font-bold text-[#f8f4ee] leading-tight">
            Create exercise
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <SectionLabel>Exercise name *</SectionLabel>
            <input
              type="text"
              placeholder="e.g. Incline Dumbbell Curl"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className="w-full bg-white/[0.04] border rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none transition-colors"
              style={{
                borderColor: errors.name ? "#ef4444" : "rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => (e.target.style.borderColor = ACTIVE_COLOR)}
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
              placeholder="Describe the exercise, form cues, common mistakes..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none resize-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = ACTIVE_COLOR)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <div>
            <SectionLabel>
              Video URL{" "}
              <span className="normal-case tracking-normal text-white/20 text-[10px]">
                optional
              </span>
            </SectionLabel>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/25 focus:outline-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = ACTIVE_COLOR)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <div>
            <SectionLabel>Muscle group *</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((mg) => (
                <SelectButton
                  key={mg}
                  label={mg}
                  selected={form.muscleGroup === mg}
                  onClick={() => {
                    setForm({ ...form, muscleGroup: mg });
                    if (errors.muscleGroup)
                      setErrors({ ...errors, muscleGroup: null });
                  }}
                />
              ))}
            </div>
            {errors.muscleGroup && (
              <p className="text-xs text-red-400 mt-2">{errors.muscleGroup}</p>
            )}
          </div>

          <div>
            <SectionLabel>Equipment type *</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.map((eq) => (
                <SelectButton
                  key={eq}
                  label={eq}
                  selected={form.equipmentType === eq}
                  onClick={() => {
                    setForm({ ...form, equipmentType: eq });
                    if (errors.equipmentType)
                      setErrors({ ...errors, equipmentType: null });
                  }}
                />
              ))}
            </div>
            {errors.equipmentType && (
              <p className="text-xs text-red-400 mt-2">
                {errors.equipmentType}
              </p>
            )}
          </div>

          <div>
            <SectionLabel>Difficulty level *</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lv) => (
                <SelectButton
                  key={lv}
                  label={lv}
                  selected={form.difficultyLevel === lv}
                  onClick={() => {
                    setForm({ ...form, difficultyLevel: lv });
                    if (errors.difficultyLevel)
                      setErrors({ ...errors, difficultyLevel: null });
                  }}
                />
              ))}
            </div>
            {errors.difficultyLevel && (
              <p className="text-xs text-red-400 mt-2">
                {errors.difficultyLevel}
              </p>
            )}
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 px-8 cursor-pointer hover:opacity-90 text-[#1a1a1a]"
              style={{ background: ACTIVE_COLOR }}
            >
              {loading ? "Creating..." : "Create exercise"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/exercises")}
              className="border-white/15 text-white/50 hover:bg-white/5 bg-transparent cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
