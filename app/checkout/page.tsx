"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userData);
    setCurrentUser(user);
    // Pre-fill name from account
    setShippingDetails((prev) => ({ ...prev, fullName: user.name || "" }));

    if (cart.length === 0) {
      router.push("/products");
    }
  }, [router, cart]);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const userData = localStorage.getItem("currentUser");
      if (!userData) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userData);
      const clientId = user._id;

      if (!clientId) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("currentUser");
        router.push("/login");
        return;
      }

      for (const product of cart) {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            clientId,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to place order for ${product.title}`);
        }
      }

      clearCart();
      router.push("/checkout/success");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push("/products")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Order Summary */}
          <div className="space-y-6">

            {/* Logged-in user info */}
            {currentUser && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Account</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                    </div>
                    <p className="text-indigo-600 font-bold whitespace-nowrap">${product.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Shipping & Place Order */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 03001234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                  placeholder="House no, Street, Area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Karachi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 75500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-2">
                <p className="text-sm text-blue-800">
                  By placing this order, you agree to purchase the items in your cart.
                  Stock will be automatically deducted when the order is placed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : `Place Order — $${getTotalPrice().toFixed(2)}`}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
