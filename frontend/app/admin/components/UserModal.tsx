"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import api from "@/app/lib/api";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

interface Props {
  mode: "add" | "edit";
  user?: User | null; // required when mode === "edit"
  onClose: () => void;
  onSuccess: () => void;
}

const inputCls =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-medium placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors duration-200";

const selectCls =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-cyan-500 transition-colors duration-200";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function UserModal({ mode, user, onClose, onSuccess }: Props) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && user) {
      setForm({ username: user.username, role: user.role, password: "" });
    }
  }, [isEdit, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEdit && user) {
        const payload: any = { username: form.username, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/admin/users/${user.id}`, payload);
      } else {
        await api.post("/admin/users", form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (isEdit ? "Failed to update user." : "Failed to create user."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit — ${user?.username}` : "Add New User"}
      onClose={onClose}
    >
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Username">
          <input
            type="text"
            required
            autoFocus
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={inputCls}
            placeholder="Enter username"
          />
        </Field>

        <Field label={isEdit ? "New Password" : "Password"}>
          <input
            type="password"
            required={!isEdit}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputCls}
            placeholder={
              isEdit ? "Leave blank to keep current" : "Enter password"
            }
          />
        </Field>

        <Field label="Role">
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className={selectCls}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </Field>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
