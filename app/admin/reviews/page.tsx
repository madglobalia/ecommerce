"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Review {
  _id: string;
  clientName: string;
  productName?: string;
  rating: number;
  title: string;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNote?: string;
  createdAt: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}>{s <= rating ? "⭐" : "☆"}</span>
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Pending" | "Approved" | "Rejected" | "All">("Pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAction = async (id: string, status: "Approved" | "Rejected") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: adminNotes[id] || "" }),
      });
      if (res.ok) await fetchReviews();
      else { const d = await res.json(); alert(d.error || "Failed"); }
    } catch { alert("Something went wrong"); }
    finally { setProcessingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    await fetchReviews();
  };

  const filtered = filter === "All" ? reviews : reviews.filter((r) => r.status === filter);

  const counts = {
    All: reviews.length,
    Pending: reviews.filter((r) => r.status === "Pending").length,
    Approved: reviews.filter((r) => r.status === "Approved").length,
    Rejected: reviews.filter((r) => r.status === "Rejected").length,
  };

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-gray-500 text-sm mt-1">Approve reviews to show them on the public review page</p>
          </div>
          <button onClick={fetchReviews} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
            🔄 Refresh
          </button>
        </div>

        {/* Pending alert */}
        {counts.Pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <p className="text-yellow-800 font-semibold">
              {counts.Pending} pending review{counts.Pending > 1 ? "s" : ""} awaiting approval
            </p>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["Pending", "All", "Approved", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                filter === tab
                  ? tab === "Pending" ? "bg-yellow-500 text-white"
                  : tab === "Approved" ? "bg-green-600 text-white"
                  : tab === "Rejected" ? "bg-red-600 text-white"
                  : "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-xs ${filter === tab ? "bg-white/30" : "bg-gray-100 text-gray-600"}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Reviews */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-5xl mb-4">⭐</p>
            <p className="text-gray-500">No {filter.toLowerCase()} reviews</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{review.clientName}</p>
                      {review.productName && (
                        <p className="text-xs text-gray-500">📦 {review.productName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[review.status]}`}>
                      {review.status === "Pending" && "⏳ "}
                      {review.status === "Approved" && "✅ "}
                      {review.status === "Rejected" && "❌ "}
                      {review.status}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Review content */}
                <div className="px-6 py-4">
                  <h3 className="font-bold text-gray-800 mb-1">"{review.title}"</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>

                {/* Admin actions — only for pending */}
                {review.status === "Pending" && (
                  <div className="px-6 pb-5">
                    <input
                      type="text"
                      placeholder="Admin note (optional)..."
                      value={adminNotes[review._id] || ""}
                      onChange={(e) => setAdminNotes((prev) => ({ ...prev, [review._id]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(review._id, "Approved")}
                        disabled={processingId === review._id}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleAction(review._id, "Rejected")}
                        disabled={processingId === review._id}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}

                {/* Already processed */}
                {review.status !== "Pending" && (
                  <div className={`px-6 pb-4 flex items-center justify-between`}>
                    {review.adminNote && (
                      <p className="text-sm text-gray-500 italic">Note: "{review.adminNote}"</p>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="ml-auto px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
