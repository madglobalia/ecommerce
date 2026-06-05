"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 10;

interface ReturnRequest {
  requested: boolean;
  reason: string;
  customReason: string;
  requestedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
  adminResponse: string;
  respondedAt: string;
}

interface Order {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    image: string;
    description: string;
  };
  clientId: { _id: string; name: string; email: string };
  quantity: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
  shippedAt: string;
  deliveredAt: string;
  returnRequest?: ReturnRequest;
}

const RETURN_REASONS = [
  "Product is damaged or defective",
  "Wrong product delivered",
  "Product does not match description",
  "Product is of poor quality",
  "Changed my mind / No longer needed",
  "Other (please specify below)",
];

const TRACKING_STEPS = [
  { key: "Processing", label: "Order Placed", icon: "📋", desc: "Your order has been received" },
  { key: "Shipped",    label: "Shipped",      icon: "🚚", desc: "Your order is on the way" },
  { key: "Delivered",  label: "Delivered",    icon: "✅", desc: "Order delivered successfully" },
];

function getStepIndex(status: string) {
  if (status === "Delivered" || status === "Returned") return 2;
  if (status === "Shipped") return 1;
  return 0;
}

function TrackingBar({ order }: { order: Order }) {
  const currentStep = getStepIndex(order.status);
  return (
    <div className="px-6 py-5 bg-blue-50 border-t">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">🚚 Order Tracking</h4>
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 mx-8">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {TRACKING_STEPS.map((step, index) => {
            const isDone = index <= currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={step.key} className="flex flex-col items-center w-1/3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 border-2 transition-all ${
                  isDone ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-300 text-gray-400"
                } ${isCurrent ? "ring-4 ring-indigo-200" : ""}`}>
                  {step.icon}
                </div>
                <p className={`mt-2 text-xs font-semibold text-center ${isDone ? "text-indigo-700" : "text-gray-400"}`}>{step.label}</p>
                <p className="text-xs text-gray-400 text-center mt-0.5">{step.desc}</p>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {index === 0 && new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {index === 1 && (order.shippedAt ? new Date(order.shippedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—")}
                  {index === 2 && (order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Returned" && order.estimatedDelivery && (
        <div className="mt-5 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-indigo-100">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-xs text-gray-500">Estimated Delivery</p>
            <p className="text-sm font-bold text-indigo-700">
              {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Return modal component
function ReturnModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-select "Other" when user types in custom box
  const handleCustomReasonChange = (text: string) => {
    setCustomReason(text);
    if (text.trim() && !selectedReason) {
      setSelectedReason("Other (please specify below)");
      setError("");
    }
  };

  const handleSubmit = async () => {
    // If custom text written but no radio selected, auto-use "Other"
    const finalReason = selectedReason || (customReason.trim() ? "Other (please specify below)" : "");

    if (!finalReason) { setError("Please select a reason"); return; }
    if (finalReason === "Other (please specify below)" && !customReason.trim()) {
      setError("Please describe your reason"); return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${order._id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: finalReason, customReason }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Modal header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Return</h2>
            <p className="text-sm text-gray-500 mt-0.5">7-Day Return Policy</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Product info */}
        <div className="px-6 py-4 flex items-center gap-3 bg-gray-50 border-b">
          {order.productId?.image && (
            <img src={order.productId.image} alt={order.productId.title} className="w-14 h-14 object-cover rounded-lg border" />
          )}
          <div>
            <p className="font-semibold text-gray-800">{order.productId?.title}</p>
            <p className="text-sm text-gray-500">₹{order.totalAmount} · Qty: {order.quantity}</p>
          </div>
        </div>

        {/* Return policy note */}
        <div className="mx-6 mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <p className="text-sm text-blue-700">
            You can return this product within <strong>7 days</strong> of delivery. 
            Refund will be processed once the return is accepted.
          </p>
        </div>

        {/* Reasons */}
        <div className="px-6 py-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Why do you want to return this product?</p>
          <div className="space-y-2">
            {RETURN_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="returnReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => { setSelectedReason(reason); setError(""); }}
                  className="mt-0.5 accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {/* Custom reason input */}
          <div className="mt-3">
            <textarea
              rows={2}
              placeholder="Additional details (optional, or required if 'Other' selected)..."
              value={customReason}
              onChange={(e) => handleCustomReasonChange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
          >
            {submitting ? "Submitting..." : "Submit Return Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) { router.push("/login"); return; }
    const user = JSON.parse(userData);
    if (!user._id) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userToken");
      router.push("/login");
      return;
    }
    const controller = new AbortController();
    fetch(`/api/orders?clientId=${user._id}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => { if (err.name !== "AbortError") console.error(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [router]);

  const fetchOrders = async (clientId: string) => {
    try {
      const res = await fetch(`/api/orders?clientId=${clientId}`, { cache: "no-store" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: "Cancelled" } : o));
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  };

  // Can return: delivered, within 7 days, no existing request
  const canReturn = (order: Order) => {
    if (order.status !== "Delivered") return false;
    if (order.returnRequest?.requested) return false;
    const deliveredAt = order.deliveredAt || order.createdAt;
    const days = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  };

  const daysLeftForReturn = (order: Order) => {
    const deliveredAt = order.deliveredAt || order.createdAt;
    const days = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(7 - days));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped":    return "bg-purple-100 text-purple-700";
      case "Delivered":  return "bg-green-100 text-green-700";
      case "Cancelled":  return "bg-red-100 text-red-700";
      case "Returned":   return "bg-orange-100 text-orange-700";
      default:           return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return "⏳";
      case "Shipped":    return "🚚";
      case "Delivered":  return "✅";
      case "Cancelled":  return "❌";
      case "Returned":   return "↩️";
      default:           return "📦";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <a href="/products" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b bg-gray-50 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Order ID</p>
                    <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Order Date</p>
                    <p className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Payment</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.paymentMethod === "COD" ? "💵 COD" :
                       order.paymentMethod === "UPI" ? "📱 UPI" : "💳 Card"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>

                {/* Product */}
                <div className="px-6 py-4 flex items-center gap-4">
                  {order.productId?.image ? (
                    <img src={order.productId.image} alt={order.productId.title} className="w-20 h-20 object-cover rounded-lg border" />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">📦</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{order.productId?.title || "Product"}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{order.productId?.description}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Tracking */}
                {order.status !== "Cancelled" && order.status !== "Returned" && (
                  <TrackingBar order={order} />
                )}

                {/* Cancelled */}
                {order.status === "Cancelled" && (
                  <div className="px-6 py-4 bg-red-50 border-t flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-semibold text-red-700">Order Cancelled</p>
                      <p className="text-sm text-red-500">This order has been cancelled.</p>
                    </div>
                  </div>
                )}

                {/* Return status display */}
                {order.returnRequest?.requested && (
                  <div className={`px-6 py-4 border-t ${
                    order.returnRequest.status === "Accepted" ? "bg-green-50" :
                    order.returnRequest.status === "Rejected" ? "bg-red-50" : "bg-yellow-50"
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {order.returnRequest.status === "Accepted" ? "✅" :
                         order.returnRequest.status === "Rejected" ? "❌" : "⏳"}
                      </span>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          order.returnRequest.status === "Accepted" ? "text-green-700" :
                          order.returnRequest.status === "Rejected" ? "text-red-700" : "text-yellow-700"
                        }`}>
                          Return Request — {order.returnRequest.status}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          Reason: {order.returnRequest.reason}
                        </p>
                        {order.returnRequest.customReason && (
                          <p className="text-sm text-gray-500 italic">"{order.returnRequest.customReason}"</p>
                        )}
                        {order.returnRequest.status === "Pending" && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Your request is being reviewed by our team.
                          </p>
                        )}
                        {order.returnRequest.status === "Accepted" && (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            ✅ Return accepted! Refund of ₹{order.totalAmount.toFixed(2)} will be processed shortly.
                            {order.returnRequest.adminResponse && ` · "${order.returnRequest.adminResponse}"`}
                          </p>
                        )}
                        {order.returnRequest.status === "Rejected" && order.returnRequest.adminResponse && (
                          <p className="text-xs text-red-600 mt-1">
                            Admin: "{order.returnRequest.adminResponse}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between gap-3">
                  {/* Return eligible */}
                  {canReturn(order) && (
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-500 bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                        ↩️ {daysLeftForReturn(order)} day{daysLeftForReturn(order) !== 1 ? "s" : ""} left to return
                      </div>
                      <button
                        onClick={() => setReturnOrder(order)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
                      >
                        Return Product
                      </button>
                    </div>
                  )}

                  {/* Cancel button */}
                  {order.status === "Processing" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                      className="ml-auto px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {orders.length > ITEMS_PER_PAGE && (
        <div className="max-w-4xl mx-auto px-8 pb-8">
          <Pagination
            currentPage={currentPage}
            totalItems={orders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            label="orders"
          />
        </div>
      )}

      {/* Return Modal */}
      {returnOrder && (
        <ReturnModal
          order={returnOrder}
          onClose={() => setReturnOrder(null)}
          onSuccess={() => {
            const userData = localStorage.getItem("currentUser");
            if (userData) {
              const user = JSON.parse(userData);
              setLoading(true);
              fetchOrders(user._id);
            }
          }}
        />
      )}
    </div>
  );
}
