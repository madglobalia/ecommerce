"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 8;

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart, isInCart } = useCartStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const isLoggedIn = () => !!localStorage.getItem("currentUser");

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    addToCart(product);
  };

  const handleBuyNow = (product: any) => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    addToCart(product);
    router.push("/checkout");
  };

  const paginatedWishlist = wishlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Wishlist ❤️
            {wishlist.length > 0 && (
              <span className="ml-3 text-lg text-gray-400 font-normal">
                ({wishlist.length} item{wishlist.length !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save products you love to buy them later!</p>
            <Link
              href="/products/category/electronics"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedWishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-5xl">
                      📦
                    </div>
                  )}

                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform text-pink-500 hover:text-red-600"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>

                  {/* Out of stock */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="font-bold text-gray-800 text-base mb-1 line-clamp-1 cursor-pointer hover:text-indigo-600 transition"
                    onClick={() => router.push(`/product/${product._id}`)}
                  >
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3 flex-1">
                    {product.description}
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">
                    ₹{product.price?.toLocaleString()}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isInCart(product._id)
                          ? "bg-gray-900 text-white"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : isInCart(product._id)
                        ? "✓ In Cart"
                        : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                      className={`py-2 px-3 rounded-xl text-sm font-semibold transition ${
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {wishlist.length > ITEMS_PER_PAGE && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalItems={wishlist.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                label="wishlist items"
              />
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
