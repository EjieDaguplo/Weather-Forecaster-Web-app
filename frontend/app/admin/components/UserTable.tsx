"use client";
import { useState } from "react";
import api from "@/app/lib/api";
import {
  Shield,
  Trash2,
  UserPlus,
  Loader2,
  ShieldOff,
  Pencil,
  X,
} from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

interface Props {
  users: User[];
  loading: boolean;
  onDelete: (id: number) => void;
  onToggleRole: (id: number, role: string) => void;
  onRefresh: () => void;
}

// ─── Reusable Modal Shell ───────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-black tracking-widest text-white uppercase">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Field Component ────────────────────────────────────────────────────────
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

const inputCls =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-medium placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors duration-200";

const selectCls =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-cyan-500 transition-colors duration-200";

export default function UserTable({
  users,
  loading,
  onDelete,
  onToggleRole,
  onRefresh,
}: Props) {
  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    role: "user",
    password: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete modal
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Add ──────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setAddForm({ username: "", password: "", role: "user" });
    setAddError("");
    setShowAdd(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      await api.post("/admin/users", addForm);
      setShowAdd(false);
      onRefresh();
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ username: u.username, role: u.role, password: "" });
    setEditError("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditLoading(true);
    setEditError("");
    try {
      const payload: any = {
        username: editForm.username,
        role: editForm.role,
      };
      if (editForm.password) payload.password = editForm.password;
      await api.put(`/admin/users/${editUser.id}`, payload);
      setEditUser(null);
      onRefresh();
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/${deleteUser.id}`);
      onDelete(deleteUser.id);
      setDeleteUser(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-slate-900 border border-slate-800/60 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {users.length} Users
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-widest uppercase transition-colors duration-200"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add User
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-600 font-bold text-sm tracking-widest uppercase">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {["ID", "Username", "Role", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-bold tracking-widest text-slate-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      #{u.id}
                    </td>
                    <td className="px-6 py-4 text-white font-black">
                      {u.username}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 text-xs font-bold tracking-widest uppercase border"
                        style={
                          u.role === "admin"
                            ? {
                                color: "#facc15",
                                borderColor: "rgba(250,204,21,0.3)",
                                background: "rgba(250,204,21,0.08)",
                              }
                            : {
                                color: "#22d3ee",
                                borderColor: "rgba(34,211,238,0.3)",
                                background: "rgba(34,211,238,0.08)",
                              }
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(u)}
                          title="Edit user"
                          className="p-2 hover:bg-slate-700 transition-colors group"
                        >
                          <Pencil className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </button>
                        {/* Toggle Role */}
                        <button
                          onClick={() => onToggleRole(u.id, u.role)}
                          title="Toggle role"
                          className="p-2 hover:bg-slate-700 transition-colors group"
                        >
                          {u.role === "admin" ? (
                            <ShieldOff className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                          ) : (
                            <Shield className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteUser(u)}
                          title="Delete user"
                          className="p-2 hover:bg-red-500/10 transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-600 font-bold text-sm tracking-widest uppercase"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add User Modal ─────────────────────────────────────────────────── */}
      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          {addError && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {addError}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex flex-col gap-5">
            <Field label="Username">
              <input
                type="text"
                required
                autoFocus
                value={addForm.username}
                onChange={(e) =>
                  setAddForm({ ...addForm, username: e.target.value })
                }
                className={inputCls}
                placeholder="Enter username"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
                className={inputCls}
                placeholder="Enter password"
              />
            </Field>
            <Field label="Role">
              <select
                value={addForm.role}
                onChange={(e) =>
                  setAddForm({ ...addForm, role: e.target.value })
                }
                className={selectCls}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {addLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit User Modal ────────────────────────────────────────────────── */}
      {editUser && (
        <Modal
          title={`Edit — ${editUser.username}`}
          onClose={() => setEditUser(null)}
        >
          {editError && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {editError}
            </div>
          )}
          <form onSubmit={handleEdit} className="flex flex-col gap-5">
            <Field label="Username">
              <input
                type="text"
                required
                autoFocus
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                className={inputCls}
                placeholder="Enter username"
              />
            </Field>
            <Field label="New Password">
              <input
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
                className={inputCls}
                placeholder="Leave blank to keep current"
              />
            </Field>
            <Field label="Role">
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className={selectCls}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {editLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      {deleteUser && (
        <Modal title="Delete User" onClose={() => setDeleteUser(null)}>
          <div className="flex flex-col gap-6">
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-4">
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-white font-black">
                  {deleteUser.username}
                </span>
                ? This action{" "}
                <span className="text-red-400 font-black">
                  cannot be undone
                </span>
                .
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
