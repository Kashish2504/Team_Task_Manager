import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Users,
  Trash2,
  Pencil,
  Crown,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { projectsAPI } from "../api/projects";
import { tasksAPI } from "../api/tasks";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Badge, { priorityVariant } from "../components/Badge";
import Modal from "../components/Modal";
import TaskModal from "../components/TaskModal";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";
import { useAuth } from "../context/AuthContext";

const STATUS_COLUMNS = [
  { key: "TODO", label: "To Do", color: "border-gray-300" },
  { key: "IN_PROGRESS", label: "In Progress", color: "border-blue-300" },
  { key: "DONE", label: "Done", color: "border-green-300" },
];

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tasks");

  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [memberModal, setMemberModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isAdmin = project?.my_role === "ADMIN";
  const isOwner = project && project.owner_id === user?.id;

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, mRes, tRes] = await Promise.all([
        projectsAPI.get(id),
        projectsAPI.listMembers(id),
        tasksAPI.listForProject(id),
      ]);
      setProject(pRes.data);
      setMembers(mRes.data);
      setTasks(tRes.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    await tasksAPI.remove(taskId);
    fetchAll();
  };

  const handleDeleteProject = async () => {
    await projectsAPI.remove(id);
    navigate("/projects");
  };

  if (loading) return <Loader fullScreen />;
  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {isAdmin && (
              <Badge variant="purple">
                <Crown className="w-3 h-3 mr-1 inline" /> Admin
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">{project.description || "No description"}</p>
        </div>
        {isOwner && (
          <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4" /> Delete Project
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <TabButton active={tab === "tasks"} onClick={() => setTab("tasks")}>
            Tasks ({tasks.length})
          </TabButton>
          <TabButton active={tab === "members"} onClick={() => setTab("members")}>
            Members ({members.length})
          </TabButton>
        </nav>
      </div>

      {/* Tab Content */}
      {tab === "tasks" ? (
        <TasksBoard
          tasks={tasks}
          isAdmin={isAdmin}
          currentUserId={user?.id}
          onCreate={() => setTaskModal({ open: true, task: null })}
          onEdit={(task) => setTaskModal({ open: true, task })}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <MembersTab
          members={members}
          projectId={id}
          isAdmin={isAdmin}
          ownerId={project.owner_id}
          onInvite={() => setMemberModal(true)}
          onChange={fetchAll}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={taskModal.open}
        onClose={() => setTaskModal({ open: false, task: null })}
        projectId={id}
        members={members}
        task={taskModal.task}
        onSaved={fetchAll}
      />
      <AddMemberModal
        isOpen={memberModal}
        onClose={() => setMemberModal(false)}
        projectId={id}
        onAdded={fetchAll}
      />
      <DeleteProjectModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDeleteProject}
        name={project.name}
      />
    </div>
  );
}

function TabButton({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${
        active
          ? "border-primary-600 text-primary-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function TasksBoard({ tasks, isAdmin, currentUserId, onCreate, onEdit, onDelete, onStatusChange }) {
  return (
    <>
      <div className="flex justify-end mb-4">
        {isAdmin && (
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4" /> New Task
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description={isAdmin ? "Create the first task to get started." : "No tasks in this project yet."}
          action={
            isAdmin && (
              <Button onClick={onCreate}>
                <Plus className="w-4 h-4" /> Create Task
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{col.label}</h3>
                  <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isAdmin={isAdmin}
                      isAssignee={task.assignee_id === currentUserId}
                      onEdit={() => onEdit(task)}
                      onDelete={() => onDelete(task.id)}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function TaskCard({ task, isAdmin, isAssignee, onEdit, onDelete, onStatusChange }) {
  const canChangeStatus = isAdmin || isAssignee;

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
        {isAdmin && (
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-primary-600">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
      )}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
        {task.is_overdue && (
          <Badge variant="red">
            <AlertTriangle className="w-3 h-3 mr-0.5 inline" /> Overdue
          </Badge>
        )}
      </div>
      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>{task.assignee_name || "Unassigned"}</span>
        {task.due_date && <span>{formatDate(task.due_date)}</span>}
      </div>
      {canChangeStatus && (
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="mt-2 w-full text-xs px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-primary-500 outline-none"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      )}
    </div>
  );
}

function MembersTab({ members, projectId, isAdmin, ownerId, onInvite, onChange }) {
  const handleRemove = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await projectsAPI.removeMember(projectId, userId);
      onChange();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to remove");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await projectsAPI.updateMemberRole(projectId, userId, role);
      onChange();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update role");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {isAdmin && (
          <Button onClick={onInvite}>
            <UserPlus className="w-4 h-4" /> Add Member
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {members.map((m, i) => (
          <div
            key={m.id}
            className={`flex items-center gap-4 p-4 ${i !== 0 && "border-t border-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{m.name}</p>
                {m.user_id === ownerId && (
                  <Badge variant="purple">
                    <Crown className="w-3 h-3 mr-1 inline" /> Owner
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{m.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && m.user_id !== ownerId ? (
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                  className="text-sm px-2 py-1 border border-gray-200 rounded"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              ) : (
                <Badge variant={m.role === "ADMIN" ? "purple" : "gray"}>{m.role}</Badge>
              )}
              {isAdmin && m.user_id !== ownerId && (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AddMemberModal({ isOpen, onClose, projectId, onAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await projectsAPI.addMember(projectId, { email, role });
      onAdded();
      setEmail("");
      setRole("MEMBER");
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="member@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">User must already have an account.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteProjectModal({ isOpen, onClose, onConfirm, name }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project" size="sm">
      <p className="text-sm text-gray-700 mb-4">
        Are you sure you want to delete <strong>{name}</strong>? This will also delete all tasks and remove all members. This cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}