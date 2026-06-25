import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  BarChart2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const ACTIVE = "#c8f135";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const totalVolume = (sets) =>
  sets?.reduce((acc, s) => acc + s.repsCompleted * (s.weightKg || 0), 0) ?? 0;

const compareValue = (actual, planned) => {
  if (!planned || planned === 0) return null;
  const diff = actual - planned;
  const pct = Math.round((diff / planned) * 100);
  return { diff, pct, better: diff >= 0 };
};

function CompBadge({ actual, planned, unit = "" }) {
  const comp = compareValue(actual, planned);
  if (!comp)
    return (
      <span className="text-[#f8f4ee] text-sm font-semibold">
        {actual}
        {unit}
      </span>
    );

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#f8f4ee] text-sm font-semibold">
        {actual}
        {unit}
      </span>
      <div
        className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
        style={{
          background: comp.better
            ? "rgba(132,201,138,0.15)"
            : "rgba(224,123,84,0.15)",
          color: comp.better ? "#84c98a" : "#e07b54",
        }}
      >
        {comp.better ? (
          <TrendingUp className="w-2.5 h-2.5" />
        ) : comp.diff === 0 ? (
          <Minus className="w-2.5 h-2.5" />
        ) : (
          <TrendingDown className="w-2.5 h-2.5" />
        )}
        {comp.diff > 0 ? "+" : ""}
        {comp.pct}%
      </div>
    </div>
  );
}

function SetTable({ sets, plannedSets, plannedReps, plannedWeight }) {
  const hasPlan = !!plannedReps;
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs min-w-[300px]">
        <thead>
          <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
            <th className="text-left text-white/25 font-normal py-2 w-6">#</th>
            {hasPlan && (
              <th className="text-center text-white/25 font-normal py-2 px-2 w-20">
                Planned
              </th>
            )}
            <th className="text-center text-white/25 font-normal py-2 px-2 w-14">
              Reps
            </th>
            <th className="text-center text-white/25 font-normal py-2 px-2 w-20">
              Weight
            </th>
            <th className="text-center text-white/25 font-normal py-2 px-2 w-10">
              RPE
            </th>
            <th className="text-center text-white/25 font-normal py-2 pl-2 w-16">
              Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set, i) => (
            <tr
              key={set.id}
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
              className="hover:bg-white/[0.02]"
            >
              <td className="py-2.5 text-white/25 w-6">{i + 1}</td>
              {hasPlan && (
                <td className="py-2.5 px-2 text-center text-white/25 text-[10px] w-20">
                  {plannedReps}×{" "}
                  {plannedWeight > 0 ? `@ ${plannedWeight}kg` : "BW"}
                </td>
              )}
              <td className="py-2.5 px-2 text-center w-14">
                {hasPlan ? (
                  <CompBadge actual={set.repsCompleted} planned={plannedReps} />
                ) : (
                  <span className="text-[#f8f4ee] font-semibold">
                    {set.repsCompleted}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-2 text-center w-20">
                {hasPlan && plannedWeight > 0 ? (
                  <CompBadge
                    actual={set.weightKg}
                    planned={plannedWeight}
                    unit="kg"
                  />
                ) : (
                  <span className="text-[#f8f4ee] font-semibold">
                    {set.weightKg > 0 ? `${set.weightKg}kg` : "BW"}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-2 text-center w-10">
                {set.rpe ? (
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{
                      background:
                        set.rpe <= 6
                          ? "rgba(132,201,138,0.15)"
                          : set.rpe <= 8
                            ? "rgba(212,184,74,0.15)"
                            : "rgba(224,123,84,0.15)",
                      color:
                        set.rpe <= 6
                          ? "#84c98a"
                          : set.rpe <= 8
                            ? "#d4b84a"
                            : "#e07b54",
                    }}
                  >
                    {set.rpe}
                  </span>
                ) : (
                  <span className="text-white/20">—</span>
                )}
              </td>
              <td className="py-2.5 pl-2 text-center text-white/40 w-16">
                {Math.round(set.repsCompleted * (set.weightKg || 0))}kg
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExerciseSection({ exerciseName, sets, workoutExercise }) {
  const [open, setOpen] = useState(true);
  const vol = totalVolume(sets);
  const planned = workoutExercise;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <Dumbbell className="w-4 h-4 text-white/30" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#f8f4ee] text-sm font-medium truncate">
            {exerciseName}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-white/30">
              {sets.length} sets
            </span>
            <span className="text-[10px] text-white/30">
              {Math.round(vol)}kg volume
            </span>
            {planned && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: `${ACTIVE}15`, color: ACTIVE }}
              >
                vs plan
              </span>
            )}
          </div>
        </div>
        <span className="text-white/25 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <SetTable
            sets={sets}
            plannedSets={planned?.sets}
            plannedReps={planned?.reps}
            plannedWeight={planned?.weightKg}
          />
        </div>
      )}
    </div>
  );
}

export default function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("exercises");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/sessions/${id}`);
        setSession(res.data);
      } catch {
        toast.error("Failed to load session");
        navigate("/sessions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const deleteSession = async () => {
    try {
      await axiosInstance.delete(`/sessions/${id}`);
      toast.success("Session deleted");
      navigate("/sessions");
    } catch {
      toast.error("Failed to delete session");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-white/15 rounded-full animate-spin"
          style={{ borderTopColor: ACTIVE }}
        />
      </div>
    );

  if (!session) return null;

  const exerciseGroups =
    session.sets?.reduce((acc, set) => {
      const key = set.exercise?.id;
      if (!acc[key]) {
        acc[key] = {
          exerciseId: key,
          exerciseName: set.exercise?.name || "Unknown",
          workoutExercise: set.workoutExercise || null,
          sets: [],
        };
      }
      acc[key].sets.push(set);
      return acc;
    }, {}) ?? {};

  const groups = Object.values(exerciseGroups);

  const vol = totalVolume(session.sets);
  const avgRpe = session.sets
    ?.filter((s) => s.rpe)
    .reduce((a, s, _, arr) => a + s.rpe / arr.length, 0);

  // for plan-based sessions
  const comparisonData = groups
    .filter((g) => g.workoutExercise)
    .map((g) => ({
      name: g.exerciseName.split(" ").slice(0, 2).join(" "),
      "Planned reps": g.workoutExercise.reps * g.workoutExercise.sets,
      "Actual reps": g.sets.reduce((a, s) => a + s.repsCompleted, 0),
      "Planned vol": Math.round(
        g.workoutExercise.reps *
          g.workoutExercise.sets *
          (g.workoutExercise.weightKg || 0),
      ),
      "Actual vol": Math.round(totalVolume(g.sets)),
    }));

  const muscleVolume =
    session.sets?.reduce((acc, set) => {
      const muscle = set.exercise?.muscleGroup || "OTHER";
      acc[muscle] =
        (acc[muscle] || 0) + set.repsCompleted * (set.weightKg || 0);
      return acc;
    }, {}) ?? {};

  const radarData = Object.entries(muscleVolume).map(([muscle, vol]) => ({
    muscle: muscle.charAt(0) + muscle.slice(1).toLowerCase().replace(/_/g, " "),
    volume: Math.round(vol),
  }));

  const isPlanBased = !!session.workoutDay;

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/sessions")}
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sessions
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Session log
            </p>
            <h1 className="text-3xl font-bold text-[#f8f4ee] leading-tight mb-2">
              {isPlanBased ? session.workoutDay.name : "Free session"}
            </h1>
            {isPlanBased && (
              <p className="text-white/35 text-sm">Following a workout plan</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-white/40">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(session.date)}
              </span>
              {session.durationMinutes && (
                <span className="flex items-center gap-1.5 text-sm text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  {session.durationMinutes} min
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-white/20 hover:text-red-400 transition-colors mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1">
              Total sets
            </p>
            <p className="text-xl font-bold text-[#f8f4ee]">
              {session.sets?.length ?? 0}
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1">
              Exercises
            </p>
            <p className="text-xl font-bold text-[#f8f4ee]">{groups.length}</p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1">
              Volume
            </p>
            <p className="text-xl font-bold text-[#f8f4ee]">
              {Math.round(vol).toLocaleString()}kg
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1">
              Avg RPE
            </p>
            <p className="text-xl font-bold text-[#f8f4ee]">
              {avgRpe ? avgRpe.toFixed(1) : "—"}
            </p>
          </div>
        </div>

        {session.notes && (
          <div
            className="mb-8 p-4 rounded-xl flex gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <FileText className="w-4 h-4 text-white/25 flex-shrink-0 mt-0.5" />
            <p className="text-white/50 text-sm leading-relaxed">
              {session.notes}
            </p>
          </div>
        )}

        <div
          className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            { key: "exercises", label: "Exercises", icon: Dumbbell },
            { key: "stats", label: "Stats", icon: BarChart2 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background:
                  activeTab === tab.key
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                color:
                  activeTab === tab.key ? "#f8f4ee" : "rgba(248,244,238,0.35)",
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "exercises" && (
          <div className="flex flex-col gap-3">
            {groups.length === 0 ? (
              <div className="text-center py-12 text-white/25 text-sm">
                No sets logged
              </div>
            ) : (
              groups.map((group) => (
                <ExerciseSection
                  key={group.exerciseId}
                  exerciseName={group.exerciseName}
                  sets={group.sets}
                  workoutExercise={group.workoutExercise}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="flex flex-col gap-6">
            {isPlanBased && comparisonData.length > 0 && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs uppercase tracking-widest text-white/30 mb-5">
                  Planned vs actual volume
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comparisonData} barGap={4}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1c1c1e",
                        border: "0.5px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    />
                    <Bar
                      dataKey="Planned vol"
                      fill="rgba(255,255,255,0.15)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Actual vol"
                      fill={ACTIVE}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {radarData.length > 2 && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs uppercase tracking-widest text-white/30 mb-5">
                  Muscle group volume distribution
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="muscle"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                    />
                    <Radar
                      dataKey="volume"
                      stroke={ACTIVE}
                      fill={ACTIVE}
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1c1c1e",
                        border: "0.5px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-xs uppercase tracking-widest text-white/30 mb-4">
                Exercise summary
              </p>
              <div className="flex flex-col gap-3">
                {groups.map((g) => {
                  const gVol = totalVolume(g.sets);
                  const maxWeight = Math.max(
                    ...g.sets.map((s) => s.weightKg || 0),
                  );
                  const totalReps = g.sets.reduce(
                    (a, s) => a + s.repsCompleted,
                    0,
                  );
                  return (
                    <div
                      key={g.exerciseId}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[#f8f4ee] text-xs">
                        {g.exerciseName}
                      </span>
                      <div className="flex gap-4 text-[10px] text-white/40">
                        <span>{g.sets.length} sets</span>
                        <span>{totalReps} reps</span>
                        {maxWeight > 0 && <span>{maxWeight}kg max</span>}
                        <span style={{ color: ACTIVE }}>
                          {Math.round(gVol)}kg vol
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  Delete this session?
                </h3>
                <p className="text-white/40 text-sm">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={deleteSession}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none cursor-pointer"
                >
                  Yes, delete
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 border-white/15 text-white/50 bg-transparent hover:bg-transparent cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
