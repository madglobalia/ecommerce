"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminInfo {
  adminId: string;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      try {
        setAdminInfo(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard",       href: "/admin/dashboard", icon: "📊" },
    { name: "Manage Products", href: "/admin/products",  icon: "📦" },
    { name: "Manage Orders",   href: "/admin/orders",    icon: "📋" },
    { name: "Manage Clients",  href: "/admin/clients",   icon: "👥" },
    { name: "Return Requests", href: "/admin/returns",   icon: "↩️" },
    { name: "Reviews",         href: "/admin/reviews",   icon: "⭐" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex flex-col h-full">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

          {/* Admin info card */}
          {adminInfo && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-semibold text-sm truncate">
                    {adminInfo.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{adminInfo.email}</p>
                  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mt-1 capitalize">
                    {adminInfo.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout at bottom */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors mt-4"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
