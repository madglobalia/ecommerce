"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  productId: any;
  clientId: any;
  quantity: number;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`/api/orders?clientId=${user._id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {order.productId?.image && (
                    <img
                      src={order.productId.image}
                      alt={order.productId.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  {!order.productId?.image && (
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {order.productId?.title || "Product"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {order.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600">
                      ${order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
