import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import {
  BarChart2,
  TrendingUp,
  Calendar,
  Dumbbell,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ACTIVE = "#c8f135";

const PERIODS = [
  { key: "week", label: "This week", days: 7 },
  { key: "month", label: "This month", days: 30 },
  { key: "3months", label: "3 months", days: 90 },
];

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className="p-5 rounded-xl flex flex-col"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
        {label}
      </span>
      <span
        className="text-2xl font-bold"
        style={{ color: accent || "#f8f4ee" }}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-white/25 mt-1">{sub}</span>}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-xs uppercase tracking-widest text-white/30 mb-5">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Progress() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("month");
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planSessions, setPlanSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);

  const days = PERIODS.find((p) => p.key === period)?.days ?? 30;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const to = new Date().toISOString().split("T")[0];
        const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const [sessRes, planRes] = await Promise.all([
          axiosInstance.get(
            `/sessions?from=${from}&to=${to}&pageNum=0&pageSize=100`,
          ),
          axiosInstance.get("/plans?pageNum=0&pageSize=50"),
        ]);

        setSessions(sessRes.data.content);
        setPlans(planRes.data.content);
      } catch {
        toast.error("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period]);

  useEffect(() => {
    if (!selectedPlan) {
      setPlanSessions([]);
      return;
    }
    const fetch = async () => {
      try {
        // sessions that followed days from selected plan
        console.log(selectedPlan);
        const dayIds = selectedPlan.days?.map((d) => d.id) ?? [];
        const all = await Promise.all(
          dayIds.map((dayId) => axiosInstance.get(`/sessions/by-day/${dayId}`)),
        );
        const merged = all.flatMap((r) => {
          return (r.data.sessions || []).map((s) => ({
            ...s,
            workoutDayName: r.data.workoutDay?.name,
          }));
        });
        merged.sort((a, b) => new Date(a.date) - new Date(b.date));
        setPlanSessions(merged);
      } catch {
        toast.error("Failed to load plan sessions");
      }
    };
    fetch();
  }, [selectedPlan]);

  const totalVol = sessions.reduce(
    (acc, s) =>
      acc +
      (s.sets?.reduce(
        (a, set) => a + set.repsCompleted * (set.weightKg || 0),
        0,
      ) ?? 0),
    0,
  );

  const plannedCount = sessions.filter((s) => s.workoutDay).length;
  const freeCount = sessions.length - plannedCount;

  const volumeByDay = sessions.reduce((acc, s) => {
    const d = s.date;
    acc[d] =
      (acc[d] || 0) +
      (s.sets?.reduce(
        (a, set) => a + set.repsCompleted * (set.weightKg || 0),
        0,
      ) ?? 0);
    return acc;
  }, {});
  const volumeChart = Object.entries(volumeByDay)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, vol]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: Math.round(vol),
    }));

  const sessionsByWeek = sessions.reduce((acc, s) => {
    const d = new Date(s.date);
    const week = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString("en-US", { month: "short" })}`;
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});
  const sessionsChart = Object.entries(sessionsByWeek).map(([week, count]) => ({
    week,
    sessions: count,
  }));

  const planVolumeChart = planSessions.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    day: s.workoutDayName || "Session",
    volume: Math.round(
      s.sets?.reduce(
        (a, set) => a + set.repsCompleted * (set.weightKg || 0),
        0,
      ) ?? 0,
    ),
    sets: s.sets?.length ?? 0,
  }));

  const exerciseVolumes = {};
  sessions.forEach((s) => {
    s.sets?.forEach((set) => {
      const name = set.exercise?.name;
      if (!name) return;
      if (!exerciseVolumes[name])
        exerciseVolumes[name] = { name, maxWeight: 0, totalVol: 0, count: 0 };
      exerciseVolumes[name].maxWeight = Math.max(
        exerciseVolumes[name].maxWeight,
        set.weightKg || 0,
      );
      exerciseVolumes[name].totalVol += set.repsCompleted * (set.weightKg || 0);
      exerciseVolumes[name].count++;
    });
  });
  const topExercises = Object.values(exerciseVolumes)
    .sort((a, b) => b.totalVol - a.totalVol)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Training analytics
            </p>
            <h1 className="text-4xl font-bold text-[#f8f4ee]">Progress</h1>
          </div>
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    period === p.key ? "rgba(255,255,255,0.08)" : "transparent",
                  color:
                    period === p.key ? "#f8f4ee" : "rgba(248,244,238,0.35)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div
              className="w-8 h-8 border-2 border-white/15 rounded-full animate-spin"
              style={{ borderTopColor: ACTIVE }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Sessions"
                value={sessions.length}
                sub={`in ${days} days`}
                accent={ACTIVE}
              />
              <StatCard
                label="Total volume"
                value={`${Math.round(totalVol).toLocaleString()}kg`}
                sub="reps × weight"
              />
              <StatCard
                label="Plan-based"
                value={plannedCount}
                sub={`${freeCount} free`}
              />
              <StatCard
                label="Avg volume"
                value={
                  sessions.length
                    ? `${Math.round(totalVol / sessions.length).toLocaleString()}kg`
                    : "—"
                }
                sub="per session"
              />
            </div>

            {volumeChart.length > 1 && (
              <ChartCard title="Volume over time">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={volumeChart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
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
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke={ACTIVE}
                      strokeWidth={2}
                      dot={{ fill: ACTIVE, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {sessionsChart.length > 0 && (
              <ChartCard title="Session frequency">
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={sessionsChart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
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
                    />
                    <Bar
                      dataKey="sessions"
                      fill={ACTIVE}
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Plan progress */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs uppercase tracking-widest text-white/30">
                  Plan progress
                </p>
                <div className="relative">
                  <button
                    onClick={() => setShowPlanDropdown((d) => !d)}
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      color: "rgba(248,244,238,0.6)",
                    }}
                  >
                    {selectedPlan ? selectedPlan.name : "Select a plan"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showPlanDropdown && (
                    <div
                      className="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden w-56"
                      style={{
                        background: "#1c1c1e",
                        border: "0.5px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {plans.length === 0 ? (
                        <p className="text-white/25 text-xs p-3">
                          No plans found
                        </p>
                      ) : (
                        plans.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPlan(p);
                              setShowPlanDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-xs hover:bg-white/[0.06] transition-colors"
                            style={{
                              color:
                                selectedPlan?.id === p.id
                                  ? ACTIVE
                                  : "rgba(248,244,238,0.7)",
                              borderBottom:
                                "0.5px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            {p.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!selectedPlan ? (
                <p className="text-white/20 text-sm text-center py-8">
                  Select a plan to see your progress
                </p>
              ) : planSessions.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">
                  No sessions logged following this plan yet
                </p>
              ) : (
                <>
                  <div className="flex gap-3 mb-5 flex-wrap">
                    <div
                      className="px-4 py-2 rounded-lg text-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p className="text-[10px] text-white/30 mb-0.5">
                        Sessions completed
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: ACTIVE }}
                      >
                        {planSessions.length}
                      </p>
                    </div>
                    <div
                      className="px-4 py-2 rounded-lg text-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p className="text-[10px] text-white/30 mb-0.5">
                        Last session
                      </p>
                      <p className="text-sm font-semibold text-[#f8f4ee]">
                        {new Date(
                          planSessions[planSessions.length - 1]?.date,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className="px-4 py-2 rounded-lg text-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p className="text-[10px] text-white/30 mb-0.5">
                        Avg volume/session
                      </p>
                      <p className="text-sm font-semibold text-[#f8f4ee]">
                        {Math.round(
                          planSessions.reduce(
                            (a, s) =>
                              a +
                              (s.sets?.reduce(
                                (b, set) =>
                                  b + set.repsCompleted * (set.weightKg || 0),
                                0,
                              ) ?? 0),
                            0,
                          ) / planSessions.length,
                        ).toLocaleString()}
                        kg
                      </p>
                    </div>
                  </div>

                  {planVolumeChart.length > 1 && (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={planVolumeChart}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="date"
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
                          formatter={(val, name) => [`${val}kg`, name]}
                        />
                        <Line
                          type="monotone"
                          dataKey="volume"
                          stroke={ACTIVE}
                          strokeWidth={2}
                          dot={{ fill: ACTIVE, r: 3 }}
                          name="Volume"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  <div className="mt-5 flex flex-col gap-2">
                    {selectedPlan.days?.map((day) => {
                      const daySessions = planSessions.filter(
                        (s) => s.workoutDayName === day.name,
                      );
                      return (
                        <div
                          key={day.id}
                          className="flex items-center justify-between py-2"
                          style={{
                            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div>
                            <p className="text-[#f8f4ee] text-xs font-medium">
                              {day.name}
                            </p>
                            <p className="text-white/25 text-[10px] mt-0.5">
                              {day.exercises?.length} exercises planned
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/35">
                              {daySessions.length} sessions
                            </span>
                            <div className="flex gap-1">
                              {Array.from({
                                length: Math.min(daySessions.length, 5),
                              }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 rounded-full"
                                  style={{ background: ACTIVE }}
                                />
                              ))}
                              {daySessions.length === 0 && (
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Top exercises */}
            {topExercises.length > 0 && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs uppercase tracking-widest text-white/30 mb-5">
                  Top exercises by volume
                </p>
                <div className="flex flex-col gap-3">
                  {topExercises.map((ex, i) => (
                    <div key={ex.name} className="flex items-center gap-4">
                      <span className="text-[10px] text-white/20 w-4 flex-shrink-0">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#f8f4ee] text-xs font-medium truncate">
                            {ex.name}
                          </span>
                          <span className="text-[10px] text-white/35 flex-shrink-0 ml-2">
                            {Math.round(ex.totalVol).toLocaleString()}kg
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(ex.totalVol / topExercises[0].totalVol) * 100}%`,
                              background: ACTIVE,
                              opacity: 0.7 - i * 0.1,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-white/25 flex-shrink-0">
                        {ex.maxWeight > 0 ? `${ex.maxWeight}kg max` : "BW"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
                <BarChart2 className="w-10 h-10 text-white/10" />
                <p className="text-white/30 text-sm">
                  No sessions in this period
                </p>
                <button
                  onClick={() => navigate("/sessions/log")}
                  className="text-xs px-4 py-2 rounded-lg transition-all"
                  style={{ background: ACTIVE, color: "#1a1a1a" }}
                >
                  Log a session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
