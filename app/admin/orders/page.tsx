"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Pagination from "@/components/admin/Pagination";
import { showToast } from "@/components/Toast";

interface Order {
  _id: string;
  productId: any;
  clientId: any;
  quantity: number;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch orders", "error");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/orders", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          showToast("Failed to fetch orders", "error");
        }
      }
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistically update UI
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast("Order status updated", "success");
      } else {
        showToast("Failed to update order status", "error");
        fetchOrders(); // revert
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update order status", "error");
      fetchOrders();
    }
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const counts = {
    All: orders.length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Shipped":   return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Returned":  return "bg-orange-100 text-orange-800";
      default:          return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {lastUpdated ? `Last updated: ${lastUpdated}` : ""}
            </span>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === tab
                  ? tab === "Cancelled"
                    ? "bg-red-600 text-white"
                    : tab === "Delivered"
                    ? "bg-green-600 text-white"
                    : tab === "Shipped"
                    ? "bg-purple-600 text-white"
                    : tab === "Processing"
                    ? "bg-yellow-500 text-white"
                    : "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === tab ? "bg-white/30 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Order ID", "Product", "Client", "Qty", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className={`hover:bg-gray-50 ${
                      order.status === "Cancelled" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.productId?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{order.clientId?.name || "N/A"}</div>
                      <div className="text-gray-500 text-xs">{order.clientId?.email || ""}</div>
                      <div className="text-gray-400 text-xs">{order.clientId?.uniqueId || ""}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.paymentMethod === "COD"
                        ? "💵 COD"
                        : order.paymentMethod === "UPI"
                        ? "📱 UPI"
                        : order.paymentMethod === "STRIPE"
                        ? "💳 Card"
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status === "Cancelled"  && "❌ "}
                        {order.status === "Delivered"  && "✅ "}
                        {order.status === "Shipped"    && "🚚 "}
                        {order.status === "Processing" && "⏳ "}
                        {order.status === "Returned"   && "↩️ "}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === "Cancelled" ? (
                        <span className="text-xs text-red-500 font-medium">Cancelled by client</span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filter === "Cancelled" ? "No cancelled orders" : "No orders found"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          label="orders"
        />

      </div>
    </AdminLayout>
  );
}
