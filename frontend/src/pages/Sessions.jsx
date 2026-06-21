import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  Clock,
  Dumbbell,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ACTIVE = "#c8f135";

function StatCard({ label, value, sub }) {
  return (
    <div
      className="flex flex-col p-5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
        {label}
      </span>
      <span className="text-2xl font-bold text-[#f8f4ee]">{value}</span>
      {sub && <span className="text-[11px] text-white/30 mt-1">{sub}</span>}
    </div>
  );
}

function SessionCard({ session, onClick }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(session.date);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
      style={{
        background: hovered
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.03)",
        border: hovered
          ? "0.5px solid rgba(255,255,255,0.15)"
          : "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-[10px] text-white/30 uppercase">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-[#f8f4ee] text-base font-bold leading-none">
          {date.getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#f8f4ee] text-sm font-medium truncate">
          {session.workoutDay ? session.workoutDay.name : "Free session"}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Dumbbell className="w-3 h-3" />
            {session.sets?.length ?? 0} sets
          </span>
          {session.durationMinutes && (
            <span className="text-[10px] text-white/30 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {session.durationMinutes}min
            </span>
          )}
          {session.workoutDay && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: `${ACTIVE}15`, color: ACTIVE }}
            >
              planned
            </span>
          )}
        </div>
      </div>
      <ArrowRight
        className="w-4 h-4 text-white/20 flex-shrink-0"
        style={{ color: hovered ? "rgba(255,255,255,0.5)" : undefined }}
      />
    </div>
  );
}

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalVolume: 0,
  });
  const [volumeData, setVolumeData] = useState([]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/sessions?pageNum=${page}&pageSize=10`,
      );
      setSessions(res.data.content);
      setTotalPages(res.data.page?.totalPages ?? res.data.totalPages ?? 0);

      // stats from all sessions on first page
      const all = res.data.content;
      const now = new Date();
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = all.filter((s) => new Date(s.date) >= weekAgo).length;
      const thisMonth = all.filter((s) => new Date(s.date) >= monthAgo).length;
      const totalVolume = all.reduce(
        (acc, s) =>
          acc +
          (s.sets?.reduce(
            (a, set) => a + set.repsCompleted * (set.weightKg || 0),
            0,
          ) ?? 0),
        0,
      );

      setStats({
        total: res.data.page?.totalElements ?? all.length,
        thisWeek,
        thisMonth,
        totalVolume: Math.round(totalVolume),
      });

      // volume over time chart data
      const chartData = all
        .slice()
        .reverse()
        .map((s) => ({
          date: new Date(s.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          volume: Math.round(
            s.sets?.reduce(
              (a, set) => a + set.repsCompleted * (set.weightKg || 0),
              0,
            ) ?? 0,
          ),
        }));
      setVolumeData(chartData);
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [page]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">
              Training history
            </p>
            <h1 className="text-4xl font-bold text-[#f8f4ee]">Sessions</h1>
          </div>
          <Button
            onClick={() => navigate("/sessions/log")}
            className="gap-2"
            style={{ background: ACTIVE, color: "#1a1a1a" }}
          >
            <Plus className="w-4 h-4" /> Log session
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatCard label="Total sessions" value={stats.total} />
          <StatCard
            label="This week"
            value={stats.thisWeek}
            sub="last 7 days"
          />
          <StatCard
            label="This month"
            value={stats.thisMonth}
            sub="last 30 days"
          />
          <StatCard
            label="Total volume"
            value={`${stats.totalVolume.toLocaleString()}kg`}
            sub="reps × weight"
          />
        </div>

        {volumeData.length > 1 && (
          <div
            className="mb-10 p-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="w-4 h-4 text-white/30" />
              <p className="text-xs uppercase tracking-widest text-white/30">
                Volume per session
              </p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={volumeData}>
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
                    color: "#f8f4ee",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
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
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div
              className="w-6 h-6 border-2 border-white/15 rounded-full animate-spin"
              style={{ borderTopColor: ACTIVE }}
            />
          </div>
        ) : sessions.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
            <Calendar className="w-10 h-10 text-white/10" />
            <p className="text-white/30 text-sm">No sessions logged yet</p>
            <Button
              onClick={() => navigate("/sessions/log")}
              size="sm"
              style={{ background: ACTIVE, color: "#1a1a1a" }}
            >
              Log your first session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => navigate(`/sessions/${session.id}`)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm px-4 py-2 rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
            >
              ← Prev
            </button>
            <span className="text-sm text-white/30">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm px-4 py-2 rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
