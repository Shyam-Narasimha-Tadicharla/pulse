import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Subject, CreateSubjectRequest, UpdateSubjectRequest } from "@/lib/api";

interface SubjectModalProps {
  open: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSave: (data: CreateSubjectRequest | UpdateSubjectRequest) => Promise<void>;
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-white/20";

const labelClass = "block text-xs text-white/40 mb-1.5 uppercase tracking-wider";

export default function SubjectModal({ open, subject, onClose, onSave }: SubjectModalProps) {
  const isEdit = subject !== null;
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    dateOfBirth: "",
    registeredDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setForm(
        subject
          ? { name: subject.name, email: subject.email, address: subject.address, dateOfBirth: subject.dateOfBirth, registeredDate: "" }
          : { name: "", email: "", address: "", dateOfBirth: "", registeredDate: "" }
      );
    }
  }, [open, subject]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await onSave({ name: form.name, email: form.email, address: form.address, dateOfBirth: form.dateOfBirth });
      } else {
        await onSave({ name: form.name, email: form.email, address: form.address, dateOfBirth: form.dateOfBirth, registeredDate: form.registeredDate });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? "Edit Subject" : "New Subject"}
            </h2>
            <p className="text-xs text-white/30 mt-0.5">
              {isEdit ? `Editing ${subject?.name}` : "Add a new subject to the system"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={form.name} onChange={set("name")} required className={inputClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={set("email")} required className={inputClass} placeholder="jane@example.com" />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={set("address")} required className={inputClass} placeholder="123 Main St, City" />
          </div>
          <div className={isEdit ? "" : "grid grid-cols-2 gap-4"}>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} required className={inputClass} />
            </div>
            {!isEdit && (
              <div>
                <label className={labelClass}>Registered Date</label>
                <input type="date" value={form.registeredDate} onChange={set("registeredDate")} required className={inputClass} />
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
