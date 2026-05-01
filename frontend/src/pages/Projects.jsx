import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, Users, Crown } from "lucide-react";
import { projectsAPI } from "../api/projects";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import { formatDate } from "../utils/format";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsAPI.list();
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage all your team projects</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing tasks."
          action={
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-primary-600" />
                </div>
                {p.my_role === "ADMIN" && (
                  <Badge variant="purple">
                    <Crown className="w-3 h-3 mr-1 inline" /> Admin
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[2.5rem]">
                {p.description || "No description"}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {p.members_count} member{p.members_count !== 1 && "s"}
                </div>
                <span>Created {formatDate(p.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchProjects}
      />
    </div>
  );
}

function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await projectsAPI.create({ name, description });
      onCreated();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g. Website Redesign"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="What is this project about?"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}