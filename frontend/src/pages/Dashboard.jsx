import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { dashboardAPI } from "../api/dashboard";
import Loader from "../components/Loader";
import Badge, { statusVariant, priorityVariant } from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI
      .global()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!data) return null;

  const stats = [
    { label: "Projects", value: data.projects_count, icon: FolderKanban, color: "bg-blue-500" },
    { label: "Total Tasks", value: data.total_tasks, icon: CheckSquare, color: "bg-purple-500" },
    { label: "My Tasks", value: data.my_tasks_count, icon: Clock, color: "bg-yellow-500" },
    { label: "Overdue", value: data.overdue_count, icon: AlertTriangle, color: "bg-red-500" },
    { label: "Completed", value: data.completed_count, icon: CheckCircle2, color: "bg-green-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your work today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BreakdownCard title="Tasks by Status" data={data.status_breakdown} />
        <BreakdownCard title="Tasks by Priority" data={data.priority_breakdown} />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskListCard title="Recent Tasks" tasks={data.recent_tasks} emptyText="No tasks yet" />
        <TaskListCard title="Upcoming (Next 7 Days)" tasks={data.upcoming_tasks} emptyText="Nothing due soon" />
      </div>
    </div>
  );
}

function BreakdownCard({ title, data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{key.replace("_", " ")}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskListCard({ title, tasks, emptyText }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Link
              key={t.id}
              to={`/projects/${t.project_id}`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-primary-300 hover:bg-primary-50/30 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.project_name}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={statusVariant(t.status)}>{t.status.replace("_", " ")}</Badge>
                  {t.is_overdue && <Badge variant="red">Overdue</Badge>}
                </div>
              </div>
              {t.due_date && (
                <p className="text-xs text-gray-500 mt-2">Due: {formatDate(t.due_date)}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}