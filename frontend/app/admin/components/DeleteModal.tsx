"use client";
import { useState } from "react";
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
  user: User;
  onClose: () => void;
  onSuccess: (id: number) => void;
}

export default function DeleteModal({ user, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/admin/users/${user.id}`);
      onSuccess(user.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Delete User" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-4">
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-black">{user.username}</span>? This
            action{" "}
            <span className="text-red-400 font-black">cannot be undone</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
