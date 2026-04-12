// API base — empty string uses Vite dev proxy (/auth → :4004/auth, /api → :4004/api)
// Set VITE_API_URL in .env for production builds pointing at the gateway directly
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface Subject {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
}

export interface CreateSubjectRequest {
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registeredDate: string;
}

export interface UpdateSubjectRequest {
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  getSubjects: (token: string) =>
    request<Subject[]>("/api/subjects", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createSubject: (token: string, data: CreateSubjectRequest) =>
    request<Subject>("/api/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  updateSubject: (token: string, id: string, data: UpdateSubjectRequest) =>
    request<Subject>(`/api/subjects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  deleteSubject: (token: string, id: string) =>
    request<void>(`/api/subjects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
