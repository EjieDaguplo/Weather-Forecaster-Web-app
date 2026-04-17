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
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10 fade-in">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-4xl font-bold text-white">
            System <span style={{ color: "var(--accent-gold)" }}>Control</span>
          </h1>
        </div>
        <AdminStats stats={stats} loading={loading} />
        <div className="mt-8 fade-in">
          <h2 className="font-display text-xl font-semibold text-white/80 mb-4">
            User Management
          </h2>
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
