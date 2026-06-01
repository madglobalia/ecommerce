"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
