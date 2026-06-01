"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Manage Products", href: "/admin/products", icon: "📦" },
    { name: "Manage Orders", href: "/admin/orders", icon: "📋" },
    { name: "Manage Clients", href: "/admin/clients", icon: "👥" },
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
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">Admin Panel</h1>

          <nav className="space-y-2">
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

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors mt-4"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </nav>
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
