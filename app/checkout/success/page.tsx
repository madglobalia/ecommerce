"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    if (orders.length > 0) {
      setOrderId(orders[orders.length - 1].id);
    }
  }, []); 

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase</p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/my-orders")}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => router.push("/products")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
