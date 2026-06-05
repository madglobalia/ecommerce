"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 5;

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const proceedToCheckout = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) { router.push("/login"); return; }
    router.push("/checkout");
  };

  const paginatedCart = cart.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Shopping Cart 🛒
            {cart.length > 0 && (
              <span className="ml-3 text-lg text-gray-400 font-normal">
                ({cart.length} item{cart.length !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
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

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {paginatedCart.map((product) => {
                const maxQty = Math.min(20, product.stock || 20);
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6"
                  >
                    {/* Image */}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                        📦
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                        {product.description}
                      </p>

                      {/* Price per unit */}
                      <p className="text-indigo-600 font-semibold text-sm mb-3">
                        ₹{product.price.toLocaleString()} × {product.quantity} ={" "}
                        <span className="text-lg font-bold">
                          ₹{(product.price * product.quantity).toLocaleString()}
                        </span>
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Qty:</span>
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product._id, product.quantity - 1)}
                            disabled={product.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-bold text-gray-800 text-sm">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, product.quantity + 1)}
                            disabled={product.quantity >= maxQty}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          (max {maxQty})
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => {
                        removeFromCart(product._id);
                        // If last item on current page removed, go to previous page
                        const newTotal = cart.length - 1;
                        const maxPage = Math.ceil(newTotal / ITEMS_PER_PAGE);
                        if (currentPage > maxPage && maxPage > 0) {
                          setCurrentPage(maxPage);
                        }
                      }}
                      className="flex-shrink-0 bg-red-100 text-red-600 hover:bg-red-200 w-9 h-9 rounded-lg flex items-center justify-center transition text-lg"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Pagination */}
              {cart.length > ITEMS_PER_PAGE && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={cart.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    label="cart items"
                  />
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate mr-2 flex-1">{item.title}</span>
                      <span className="flex-shrink-0">
                        {item.quantity} × ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Items</span>
                      <span>{getTotalItems()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
