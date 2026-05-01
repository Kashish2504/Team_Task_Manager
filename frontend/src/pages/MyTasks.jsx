import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, AlertTriangle } from "lucide-react";
import { tasksAPI } from "../api/tasks";
import Loader from "../components/Loader";
import Badge, { statusVariant, priorityVariant } from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = filter !== "ALL" ? { status: filter } : {};
      const res = await tasksAPI.myTasks(params);
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await tasksAPI.updateStatus(id, status);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update");
    }
  };

  const filterLabels = {
    ALL: "All",
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-1">All tasks assigned to you</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition ${
              filter === f
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            filter === "ALL"
              ? "You don't have any tasks assigned yet."
              : `No tasks in "${filterLabels[filter]}" status.`
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                i !== 0 && "border-t border-gray-100"
              } hover:bg-gray-50 transition`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Link
                    to={`/projects/${task.project_id}`}
                    className="font-medium text-gray-900 hover:text-primary-600 truncate"
                  >
                    {task.title}
                  </Link>
                  {task.is_overdue && (
                    <Badge variant="red">
                      <AlertTriangle className="w-3 h-3 mr-0.5 inline" /> Overdue
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span>📁 {task.project_name}</span>
                  {task.due_date && <span>📅 Due: {formatDate(task.due_date)}</span>}
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="text-sm px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}