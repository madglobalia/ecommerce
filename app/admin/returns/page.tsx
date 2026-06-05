"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Pagination from "@/components/admin/Pagination";

interface ReturnOrder {
  _id: string;
  productId: { title: string; image: string; price: number } | null;
  clientId: { name: string; email: string; uniqueId: string } | null;
  totalAmount: number;
  quantity: number;
  status: string;
  createdAt: string;
  deliveredAt: string;
  returnRequest: {
    requested: boolean;
    reason: string;
    customReason: string;
    requestedAt: string;
    status: "Pending" | "Accepted" | "Rejected";
    adminResponse: string;
    respondedAt: string;
  };
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Pending" | "Accepted" | "Rejected" | "All">("Pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/admin/returns", { cache: "no-store" });
      const data = await res.json();
      setReturns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/returns", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setReturns(Array.isArray(data) ? data : []))
      .catch((err) => { if (err.name !== "AbortError") console.error(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleAction = async (orderId: string, action: "accept" | "reject") => {
    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminResponse: responseText[orderId] || (action === "accept" ? "Return accepted" : "Return rejected"),
        }),
      });
      if (res.ok) {
        await fetchReturns();
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered =
    filter === "All"
      ? returns
      : returns.filter((r) => r.returnRequest.status === filter);

  const paginatedReturns = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const counts = {
    All: returns.length,
    Pending: returns.filter((r) => r.returnRequest.status === "Pending").length,
    Accepted: returns.filter((r) => r.returnRequest.status === "Accepted").length,
    Rejected: returns.filter((r) => r.returnRequest.status === "Rejected").length,
  };

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Return Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Manage product return requests from clients</p>
          </div>
          <button
            onClick={fetchReturns}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["Pending", "All", "Accepted", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                filter === tab
                  ? tab === "Pending"
                    ? "bg-yellow-500 text-white"
                    : tab === "Accepted"
                    ? "bg-green-600 text-white"
                    : tab === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab ? "bg-white/30" : "bg-gray-100 text-gray-600"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Pending alert */}
        {counts.Pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-yellow-800 font-semibold">
              {counts.Pending} pending return request{counts.Pending > 1 ? "s" : ""} awaiting your response
            </p>
          </div>
        )}

        {/* Returns list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">No {filter.toLowerCase()} return requests</p>
          </div>
        ) : (
          <>
          <div className="space-y-4">
            {paginatedReturns.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center gap-4">
                    {order.productId?.image && (
                      <img
                        src={order.productId.image}
                        alt={order.productId.title}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">
                        {order.productId?.title || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[order.returnRequest.status]}`}>
                    {order.returnRequest.status === "Pending" && "⏳ "}
                    {order.returnRequest.status === "Accepted" && "✅ "}
                    {order.returnRequest.status === "Rejected" && "❌ "}
                    {order.returnRequest.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Client info */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Client</p>
                    <p className="font-semibold text-gray-800">{order.clientId?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">{order.clientId?.email}</p>
                    <p className="text-xs text-gray-400">ID: {order.clientId?.uniqueId}</p>
                  </div>

                  {/* Order info */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Order Info</p>
                    <p className="text-sm text-gray-700">Amount: <span className="font-bold text-indigo-600">₹{order.totalAmount}</span></p>
                    <p className="text-sm text-gray-700">Qty: {order.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Delivered: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>

                  {/* Return reason */}
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Return Reason</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                      <p className="font-semibold text-gray-800">{order.returnRequest.reason}</p>
                      {order.returnRequest.customReason && (
                        <p className="text-sm text-gray-600 mt-1">
                          "{order.returnRequest.customReason}"
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Requested: {new Date(order.returnRequest.requestedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Admin response — only for pending */}
                  {order.returnRequest.status === "Pending" && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                        Your Response (optional)
                      </p>
                      <input
                        type="text"
                        placeholder="Add a message to the client..."
                        value={responseText[order._id] || ""}
                        onChange={(e) =>
                          setResponseText((prev) => ({ ...prev, [order._id]: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(order._id, "accept")}
                          disabled={processingId === order._id}
                          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
                        >
                          {processingId === order._id ? "Processing..." : "✅ Accept Return"}
                        </button>
                        <button
                          onClick={() => handleAction(order._id, "reject")}
                          disabled={processingId === order._id}
                          className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
                        >
                          {processingId === order._id ? "Processing..." : "❌ Reject Return"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin response — for processed */}
                  {order.returnRequest.status !== "Pending" && order.returnRequest.adminResponse && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Admin Response</p>
                      <div className={`rounded-lg px-4 py-3 text-sm ${
                        order.returnRequest.status === "Accepted"
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-red-50 border border-red-200 text-red-800"
                      }`}>
                        {order.returnRequest.adminResponse}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(order.returnRequest.respondedAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            label="return requests"
          />
          </>
        )}

      </div>
    </AdminLayout>
  );
}
