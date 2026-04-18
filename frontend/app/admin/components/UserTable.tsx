"use client";
import { useState } from "react";
import { Shield, ShieldOff, Pencil, Trash2, UserPlus } from "lucide-react";
import UserModal from "./UserModal";
import DeleteModal from "./DeleteModal";

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
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  return (
    <>
      <div className="bg-slate-900 border border-slate-800/60 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {users.length} Users
          </p>
          <button
            onClick={() => setShowAdd(true)}
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
                    {/* ID */}
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      #{u.id}
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 text-white font-black">
                      {u.username}
                    </td>

                    {/* Role Badge */}
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

                    {/* Created */}
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => setEditUser(u)}
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

      {/* Add Modal */}
      {showAdd && (
        <UserModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSuccess={onRefresh}
        />
      )}

      {/* Edit Modal */}
      {editUser && (
        <UserModal
          mode="edit"
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={onRefresh}
        />
      )}

      {/* Delete Modal */}
      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onSuccess={(id) => {
            onDelete(id);
          }}
        />
      )}
    </>
  );
}
