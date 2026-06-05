"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { label: "Electronics",     slug: "electronics",       emoji: "📱" },
  { label: "Clothing",        slug: "clothing",          emoji: "👗" },
  { label: "Footwear",        slug: "footwear",          emoji: "👟" },
  { label: "Computers",       slug: "computers",         emoji: "💻" },
  { label: "Furniture",       slug: "furniture",         emoji: "🛋️" },
  { label: "Kitchen",         slug: "kitchen",           emoji: "🍳" },
  { label: "Beauty",          slug: "beauty",            emoji: "💄" },
  { label: "Sports",          slug: "sports",            emoji: "⚽" },
  { label: "Accessories",     slug: "accessories",       emoji: "⌚" },
  { label: "Home Appliances", slug: "home-appliances",   emoji: "🏠" },
  { label: "Tools",           slug: "tools",             emoji: "🔧" },
];

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const checkUser = () => {
    const user = localStorage.getItem("currentUser");
    try {
      setCurrentUser(user ? JSON.parse(user) : null);
    } catch {
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    window.addEventListener("custom-login", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("custom-login", checkUser);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userToken");
    setCurrentUser(null);
    setShowUserDropdown(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-black text-white px-10 py-4 flex justify-between items-center relative z-50">
      <Link href="/">
        <h1 className="text-3xl font-bold">MyShop</h1>
      </Link>

      <nav className="flex gap-6 items-center">
        <Link href="/" className="hover:text-gray-300 transition">
          Home
        </Link>

        {/* Products with category dropdown */}
        <div
          ref={categoryRef}
          className="relative"
          onMouseEnter={() => setShowCategoryDropdown(true)}
          onMouseLeave={() => setShowCategoryDropdown(false)}
        >
          <Link
            href="/products"
            className="flex items-center gap-1 hover:text-gray-300 transition"
          >
            Products
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>

          {/* Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* All Products */}
              <Link
                href="/products"
                onClick={() => setShowCategoryDropdown(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition border-b border-gray-100 font-semibold"
              >
                <span className="text-lg">🛍️</span>
                <span>All Products</span>
              </Link>

              {/* Category grid */}
              <div className="py-1 max-h-80 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products/category/${cat.slug}`}
                    onClick={() => setShowCategoryDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition text-sm"
                  >
                    <span className="text-base w-6 text-center">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/cart" className="hover:text-gray-300 transition">
          Cart
        </Link>

        <Link href="/wishlist" className="hover:text-gray-300 transition">
          Wishlist
        </Link>

        <Link href="/my-orders" className="hover:text-gray-300 transition">
          My Orders
        </Link>

        <Link href="/reviews" className="hover:text-gray-300 transition">
          Reviews
        </Link>

        {/* User dropdown */}
        {currentUser ? (
          <div ref={userRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="bg-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {currentUser.name}
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link href="/register" className="hover:text-gray-300 transition">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
