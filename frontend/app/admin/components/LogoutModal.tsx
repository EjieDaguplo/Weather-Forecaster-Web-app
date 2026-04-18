"use client";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Props {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // Small delay for UX feel
    await new Promise((res) => setTimeout(res, 600));
    Cookies.remove("auth_token");
    Cookies.remove("auth_user");
    router.replace("/login");
  };

  return (
    <Modal title="Sign Out" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-slate-800 border border-slate-700 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-white font-black text-lg tracking-tight mb-1">
            Are you sure?
          </p>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            You will be signed out of your current session and redirected to the
            login page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
