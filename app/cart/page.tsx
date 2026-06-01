"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const router = useRouter();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const proceedToCheckout = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart 🛒</h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to your cart!</p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  {!product.image && (
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}