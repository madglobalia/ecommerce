"use client";

import { useState, useEffect } from "react";

interface Order {
  id: string;
  items: any[];
  total: number;
  customer: any;
  status: string;
  date: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <a
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-indigo-600 font-bold">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <p>{order.customer.name}</p>
                    <p>{order.customer.address}</p>
                  </div>
                  <p className="text-xl font-bold text-gray-800">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
