"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function VerifyOTPPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok) {
          setOrderDetails(data);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/my-orders");
        }, 2000);
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Order ID</h1>
          <button
            onClick={() => router.push("/my-orders")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-800">Verify Delivery OTP</h1>
          <p className="text-gray-600 mt-2">
            Enter the OTP sent to your phone to confirm delivery
          </p>
        </div>

        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order ID:</span> #{orderDetails._id?.slice(-6).toUpperCase()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Product:</span> {orderDetails.productId?.title}
            </p>
          </div>
        )}

        {success ? (
          <div className="bg-green-100 text-green-700 p-6 rounded-lg text-center">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-xl font-bold mb-2">OTP Verified Successfully!</h2>
            <p className="text-sm">Redirecting to your orders...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers and max 6 digits
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                required
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-gray-500">
          Didn't receive OTP? Contact support
        </p>
      </div>
    </div>
  );
}
