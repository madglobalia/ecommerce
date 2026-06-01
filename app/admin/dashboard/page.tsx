"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
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
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📦</div>
              <div>
                <h3 className="text-xl font-bold">Manage Products</h3>
                <p className="text-sm text-blue-100">Add, edit, delete products</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="text-xl font-bold">Manage Orders</h3>
                <p className="text-sm text-green-100">View and update orders</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/clients"
            className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">👥</div>
              <div>
                <h3 className="text-xl font-bold">Manage Clients</h3>
                <p className="text-sm text-purple-100">View registered clients</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}