"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
  stock: number;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  categoryBg?: string;
  categoryEmoji?: string;
}

export default function ProductCard({ product, categoryBg, categoryEmoji }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCartStore();
  const { addToWishlist, isInWishlist } = useWishlistStore();
  const [justAdded, setJustAdded] = useState(false);

  const isLoggedIn = () =>
    typeof window !== "undefined" && !!localStorage.getItem("currentUser");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (!isInCart(product._id)) {
      addToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn()) { router.push("/login"); return; }
    addToCart(product);
    router.push("/checkout");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn()) { router.push("/login"); return; }
    addToWishlist(product);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden group">

      {/* Image — only this navigates to product detail */}
      <div className="relative overflow-hidden">
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/product/${product._id}`)}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-52 flex items-center justify-center text-5xl ${
              categoryBg ? `bg-gradient-to-br ${categoryBg}` : "bg-gradient-to-br from-indigo-100 to-purple-100"
            }`}>
              {categoryEmoji || "📦"}
            </div>
          )}
        </div>

        {/* Wishlist heart — top right */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
          aria-label="Add to wishlist"
        >
          {isInWishlist(product._id) ? "❤️" : "🤍"}
        </button>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full pointer-events-none">
            {product.category}
          </span>
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
        {product.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3 mt-auto">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{product.price?.toLocaleString()}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : justAdded
                ? "bg-green-600 text-white scale-95"
                : isInCart(product._id)
                ? "bg-gray-900 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {product.stock === 0
              ? "Unavailable"
              : justAdded
              ? "✓ Added!"
              : isInCart(product._id)
              ? "✓ In Cart"
              : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
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
  );
}
