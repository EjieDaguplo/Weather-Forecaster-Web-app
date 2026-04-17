"use client";
import { useState } from "react";
import api from "@/app/lib/api";
import { Shield, Trash2, UserPlus, Loader2, ShieldOff } from "lucide-react";

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

export default function UserTable({
  users,
  loading,
  onDelete,
  onToggleRole,
  onRefresh,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await api.post("/admin/users", newUser);
      setNewUser({ username: "", password: "", role: "user" });
      setShowCreate(false);
      onRefresh();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
          {users.length} Users
        </p>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all"
          style={{
            background: showCreate
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,212,255,0.15)",
            color: "var(--accent-cyan)",
          }}
        >
          <UserPlus className="w-4 h-4" />
          {showCreate ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="p-5 border-b border-white/5 bg-white/3 fade-in">
          {createError && (
            <div className="mb-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {createError}
            </div>
          )}
          <form
            onSubmit={handleCreate}
            className="flex flex-wrap gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-sky-900 border border-white/10 text-white text-sm focus:outline-none font-mono"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-lg font-display font-semibold text-sm text-sky-950 flex items-center gap-2"
              style={{ background: "var(--accent-cyan)" }}
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-white/20 font-mono text-sm">
          Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["ID", "Username", "Role", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-mono text-white/30 uppercase tracking-widest"
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
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-white/40 text-sm">
                    #{u.id}
                  </td>
                  <td className="px-5 py-4 font-display font-medium text-white">
                    {u.username}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-mono uppercase tracking-widest"
                      style={{
                        background:
                          u.role === "admin"
                            ? "rgba(251,191,36,0.15)"
                            : "rgba(0,212,255,0.10)",
                        color:
                          u.role === "admin"
                            ? "var(--accent-gold)"
                            : "var(--accent-cyan)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-white/30 text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleRole(u.id, u.role)}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        title="Toggle role"
                      >
                        {u.role === "admin" ? (
                          <ShieldOff className="w-4 h-4 text-white/30 hover:text-amber-400" />
                        ) : (
                          <Shield className="w-4 h-4 text-white/30 hover:text-amber-400" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(u.id)}
                        className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-white/30 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-white/20 font-mono text-sm">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
