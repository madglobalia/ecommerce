"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/dashboard", { signal: controller.signal })
      .then((r) => r.text())
      .then((text) => { if (text) setStats(JSON.parse(text)); })
      .catch((err) => { if (err.name !== "AbortError") console.error("Dashboard error:", err); });
    return () => controller.abort();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const text = await res.text();
      if (text) setStats(JSON.parse(text));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  if (!stats) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm">Total Clients</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm">Products Sold</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.productsSold}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-600 text-sm font-semibold">Completed Orders</h3>
                <p className="text-3xl font-bold text-green-700">{stats.completedOrders || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-600 text-sm font-semibold">Cancelled Orders</h3>
                <p className="text-3xl font-bold text-red-700">{stats.cancelledOrders || 0}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Return requests alert */}
        {stats.pendingReturns > 0 && (
          <Link href="/admin/returns">
            <div className="bg-orange-50 border border-orange-300 rounded-lg p-5 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition">
              <div className="flex items-center gap-4">
                <span className="text-3xl">↩️</span>
                <div>
                  <p className="font-bold text-orange-800 text-lg">
                    {stats.pendingReturns} Pending Return Request{stats.pendingReturns > 1 ? "s" : ""}
                  </p>
                  <p className="text-orange-600 text-sm">Click to review and respond</p>
                </div>
              </div>
              <span className="text-orange-600 font-bold">View →</span>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-600 text-sm font-semibold">Returned Orders</h3>
                <p className="text-3xl font-bold text-orange-700">{stats.returnedOrders || 0}</p>
                <p className="text-xs text-orange-500 mt-1">Deducted from revenue</p>
              </div>
              <div className="text-4xl">↩️</div>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-600 text-sm font-semibold">Pending Returns</h3>
                <p className="text-3xl font-bold text-blue-700">{stats.pendingReturns || 0}</p>
                <p className="text-xs text-blue-500 mt-1">Awaiting review</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>



      </div>
    </AdminLayout>
  );
}