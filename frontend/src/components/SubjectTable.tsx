import { Pencil, Trash2 } from "lucide-react";
import type { Subject } from "@/lib/api";

interface SubjectTableProps {
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export default function SubjectTable({ subjects, onEdit, onDelete, deletingId }: SubjectTableProps) {
  if (subjects.length === 0) {
    return (
      <div className="border border-white/10 rounded-xl p-16 text-center">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-white/20 text-xl">∅</span>
        </div>
        <p className="text-white/30 font-medium">No subjects yet</p>
        <p className="text-white/20 text-sm mt-1">Click "New Subject" to add one</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Address</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Date of Birth</th>
            <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {subjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 text-sm font-medium text-white">{subject.name}</td>
              <td className="px-6 py-4 text-sm text-white/50">{subject.email}</td>
              <td className="px-6 py-4 text-sm text-white/50 hidden md:table-cell">{subject.address}</td>
              <td className="px-6 py-4 text-sm text-white/50 hidden sm:table-cell font-mono">{subject.dateOfBirth}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(subject)}
                    className="p-2 text-white/30 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(subject.id)}
                    disabled={deletingId === subject.id}
                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    {deletingId === subject.id ? (
                      <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
