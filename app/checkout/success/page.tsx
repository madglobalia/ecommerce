"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCartStore } from "@/store/cartStore";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isStripe, setIsStripe] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Stripe payment — verify and create orders
      setIsStripe(true);
      fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            clearCart();
            if (data.alreadyCreated) {
              setMessage("Your order was already processed.");
            } else {
              setMessage(`${data.ordersCreated} order${data.ordersCreated !== 1 ? "s" : ""} placed successfully!`);
            }
            setStatus("success");
          } else {
            setMessage(data.error || "Payment verification failed");
            setStatus("error");
          }
        })
        .catch(() => {
          setMessage("Something went wrong verifying your payment.");
          setStatus("error");
        });
    } else {
      // COD / UPI — already handled
      setStatus("success");
      setMessage("Your order has been placed!");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

        {status === "loading" && (
          <div className="py-10">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Verifying your payment...</p>
          </div>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </>
        )}

        {status === "success" && (
          <>
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-4">Thank you for your purchase 🎉</p>

            {isStripe && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-4 text-sm text-indigo-700 flex items-center gap-2">
                <span>💳</span>
                <span>Payment received via <strong>Stripe</strong>. {message}</span>
              </div>
            )}

            <div className="space-y-3 mt-6">
              <button
                onClick={() => router.push("/my-orders")}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push("/products/category/electronics")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
