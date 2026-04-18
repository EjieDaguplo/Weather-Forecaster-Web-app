"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/app/lib/api";
import Navbar from "@/app/components/Navbar";
import UserTable from "@/app/admin/components/UserTable";
import AdminStats from "@/app/admin/components/AdminStats";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get("auth_user");
    const token = Cookies.get("auth_token");
    if (!token || !userCookie) {
      router.replace("/login");
      return;
    }
    const parsed = JSON.parse(userCookie);
    if (parsed.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    setUser(parsed);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
      ]);
      setUsers(usersRes.data.users || []);
      setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u: any) => u.id !== id));
  };

  const handleToggleRole = async (id: number, role: string) => {
    const newRole = role === "admin" ? "user" : "admin";
    await api.put(`/admin/users/${id}`, { role: newRole });
    setUsers((prev) =>
      prev.map((u: any) => (u.id === id ? { ...u, role: newRole } : u)),
    );
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-2">
            Admin Panel
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            System{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Control
            </span>
          </h1>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} loading={loading} />

        {/* User Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-white tracking-tight">
              User Management
            </h2>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              {users.length} total
            </span>
          </div>
          <UserTable
            users={users}
            loading={loading}
            onDelete={handleDeleteUser}
            onToggleRole={handleToggleRole}
            onRefresh={fetchData}
          />
        </div>
      </main>
    </div>
  );
}
