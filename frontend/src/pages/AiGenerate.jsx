import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance";
import { Sparkles, ArrowLeft, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOALS = [
  {
    key: "MUSCLE_GAIN",
    label: "Muscle Gain",
    description: "Build size and strength through progressive overload",
    accent: "#c8a97e",
  },
  {
    key: "FAT_LOSS",
    label: "Fat Loss",
    description: "Burn fat while preserving muscle mass",
    accent: "#e07b54",
  },
  {
    key: "STRENGTH",
    label: "Strength",
    description: "Maximize raw strength on compound lifts",
    accent: "#7eb8d4",
  },
  {
    key: "ENDURANCE",
    label: "Endurance",
    description: "Improve cardiovascular capacity and stamina",
    accent: "#84c98a",
  },
  {
    key: "FLEXIBILITY",
    label: "Flexibility",
    description: "Increase mobility and range of motion",
    accent: "#b48fd4",
  },
  {
    key: "GENERAL_FITNESS",
    label: "General Fitness",
    description: "Balanced overall health and performance",
    accent: "#d4b84a",
  },
];

const LEVELS = [
  {
    key: "BEGINNER",
    label: "Beginner",
    description: "New to training or returning after a long break",
  },
  {
    key: "INTERMEDIATE",
    label: "Intermediate",
    description: "6+ months of consistent training experience",
  },
  {
    key: "ADVANCED",
    label: "Advanced",
    description: "2+ years of structured training",
  },
];

const EQUIPMENT = [
  { key: "BARBELL", label: "Barbell" },
  { key: "DUMBBELL", label: "Dumbbell" },
  { key: "MACHINE", label: "Machine" },
  { key: "CABLE", label: "Cable" },
  { key: "BODYWEIGHT", label: "Bodyweight" },
  { key: "RESISTANCE_BAND", label: "Resistance Band" },
  { key: "KETTLEBELL", label: "Kettlebell" },
  { key: "OTHER", label: "Other" },
];

const DAYS = [1, 2, 3, 4, 5, 6, 7];
const ACTIVE = "#c8f135";

function SectionLabel({ children, subtitle }) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/30">
        {children}
      </p>
      {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

function SelectCard({ label, description, accent, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col text-left p-4 rounded-xl transition-all cursor-pointer hover:opacity-90"
      style={{
        background: selected
          ? `${accent || ACTIVE}12`
          : "rgba(255,255,255,0.03)",
        border: selected
          ? `1px solid ${accent || ACTIVE}`
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          className="text-sm font-medium"
          style={{
            color: selected ? accent || ACTIVE : "rgba(248,244,238,0.75)",
          }}
        >
          {label}
        </span>
        <span
          className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            border: selected
              ? `1.5px solid ${accent || ACTIVE}`
              : "1.5px solid rgba(255,255,255,0.2)",
            background: selected ? `${accent || ACTIVE}20` : "transparent",
          }}
        >
          {selected && (
            <Check
              className="w-3 h-3"
              style={{ color: accent || ACTIVE }}
              strokeWidth={3}
            />
          )}
        </span>
      </div>
      {description && (
        <p className="text-[11px] text-white/30 leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
}

function EquipmentButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer hover:oapcity-90"
      style={{
        background: selected ? `${ACTIVE}10` : "rgba(255,255,255,0.04)",
        border: selected
          ? `1px solid ${ACTIVE}`
          : "1px solid rgba(255,255,255,0.1)",
        color: selected ? ACTIVE : "rgba(248,244,238,0.5)",
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

export default function AiGenerate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal: "",
    experienceLevel: "",
    daysPerWeek: 3,
    availableEquipment: [],
    additionalNotes: "",
  });
  const [errors, setErrors] = useState({});

  const toggleEquipment = (key) => {
    setForm((f) => ({
      ...f,
      availableEquipment: f.availableEquipment.includes(key)
        ? f.availableEquipment.filter((e) => e !== key)
        : [...f.availableEquipment, key],
    }));
    if (errors.availableEquipment)
      setErrors({ ...errors, availableEquipment: null });
  };

  const validate = () => {
    const e = {};
    if (!form.goal) e.goal = "Select a fitness goal";
    if (!form.experienceLevel)
      e.experienceLevel = "Select your experience level";
    if (form.availableEquipment.length === 0)
      e.availableEquipment = "Select at least one equipment type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/ai/generate", form);
      toast.success("AI plan generated!");
      navigate(`/plans/${res.data.id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Generation failed — please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/plans")}
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to plans
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(200,241,53,0.1)",
                border: "0.5px solid rgba(200,241,53,0.2)",
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: ACTIVE }} />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              AI Generation
            </p>
          </div>
          <h1 className="text-4xl font-bold text-[#f8f4ee] leading-tight mb-3">
            Generate your plan.
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-md">
            Tell us about your goals and available equipment. Our AI will build
            a complete personalized workout plan in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Goal */}
          <div>
            <SectionLabel subtitle="What are you training for?">
              Fitness goal *
            </SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <SelectCard
                  key={g.key}
                  label={g.label}
                  description={g.description}
                  accent={g.accent}
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
            <SectionLabel subtitle="How experienced are you?">
              Experience level *
            </SectionLabel>
            <div className="flex flex-col gap-2">
              {LEVELS.map((l) => (
                <SelectCard
                  key={l.key}
                  label={l.label}
                  description={l.description}
                  selected={form.experienceLevel === l.key}
                  onClick={() => {
                    setForm({ ...form, experienceLevel: l.key });
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

          <div>
            <SectionLabel subtitle="How many days per week can you train?">
              Training days *
            </SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, daysPerWeek: d })}
                  className="w-12 h-12 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
                  style={{
                    background:
                      form.daysPerWeek === d
                        ? `${ACTIVE}15`
                        : "rgba(255,255,255,0.04)",
                    border:
                      form.daysPerWeek === d
                        ? `1px solid ${ACTIVE}`
                        : "1px solid rgba(255,255,255,0.1)",
                    color:
                      form.daysPerWeek === d ? ACTIVE : "rgba(248,244,238,0.5)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/25 mt-2">
              {form.daysPerWeek} day{form.daysPerWeek !== 1 ? "s" : ""} per week
              selected
            </p>
          </div>

          <div>
            <SectionLabel subtitle="What equipment do you have access to?">
              Available equipment *
            </SectionLabel>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT.map((eq) => (
                <EquipmentButton
                  key={eq.key}
                  label={eq.label}
                  selected={form.availableEquipment.includes(eq.key)}
                  onClick={() => toggleEquipment(eq.key)}
                />
              ))}
            </div>
            {errors.availableEquipment && (
              <p className="text-xs text-red-400 mt-2">
                {errors.availableEquipment}
              </p>
            )}
          </div>

          <div>
            <SectionLabel subtitle="Injuries, preferences, specific exercises to include or avoid...">
              Additional notes
              <span className="normal-case tracking-normal text-white/20 text-[10px] ml-2">
                optional
              </span>
            </SectionLabel>
            <textarea
              placeholder="e.g. I have a bad left knee, prefer compound movements, no overhead pressing..."
              value={form.additionalNotes}
              onChange={(e) =>
                setForm({ ...form, additionalNotes: e.target.value })
              }
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f8f4ee] placeholder:text-white/20 focus:outline-none resize-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 px-8 h-12 text-base cursor-pointer hover:opacity-90"
              style={{
                background: loading ? "rgba(200,241,53,0.5)" : ACTIVE,
                color: "#1a1a1a",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                  Generating your plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate plan
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-[11px] text-white/20 text-center">
              Generation takes 5–15 seconds. You'll be redirected to your new
              plan.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
