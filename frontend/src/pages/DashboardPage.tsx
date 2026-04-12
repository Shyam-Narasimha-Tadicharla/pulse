import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, type Subject, type CreateSubjectRequest, type UpdateSubjectRequest } from "@/lib/api";
import Navbar from "@/components/Navbar";
import SubjectTable from "@/components/SubjectTable";
import SubjectModal from "@/components/SubjectModal";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubjects = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.getSubjects(token);
      setSubjects(data);
    } catch {
      setError("Could not load subjects. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [token]);

  const handleCreate = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await api.deleteSubject(token, id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete subject.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (data: CreateSubjectRequest | UpdateSubjectRequest) => {
    if (!token) return;
    if (editingSubject) {
      const updated = await api.updateSubject(token, editingSubject.id, data as UpdateSubjectRequest);
      setSubjects((prev) => prev.map((s) => (s.id === editingSubject.id ? updated : s)));
    } else {
      const created = await api.createSubject(token, data as CreateSubjectRequest);
      setSubjects((prev) => [...prev, created]);
    }
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Subjects</h1>
            <p className="text-white/30 mt-1 text-sm">
              {loading ? "Loading…" : `${subjects.length} record${subjects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all hover:scale-[1.02] text-sm"
          >
            <Plus className="w-4 h-4" />
            New Subject
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchSubjects}
              className="text-red-400 hover:text-red-300 text-xs underline ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/30 text-sm">Fetching subjects…</p>
          </div>
        ) : (
          <SubjectTable
            subjects={subjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </main>

      <SubjectModal
        open={modalOpen}
        subject={editingSubject}
        onClose={() => { setModalOpen(false); setEditingSubject(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
