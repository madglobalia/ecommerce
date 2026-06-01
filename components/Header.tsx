"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const checkUser = () => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUser();

    // Listen for storage changes (for when user logs in from another tab)
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("custom-login", checkUser);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("custom-login", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-black text-white px-10 py-4 flex justify-between items-center">

      <Link href="/">
        <h1 className="text-3xl font-bold">
          MyShop
        </h1>
      </Link>

      <nav className="flex gap-6 items-center">

        <Link href="/">
          Home
        </Link>

        <Link href="/products">
          Products
        </Link>

        <Link href="/cart">
          Cart
        </Link>

        <Link href="/wishlist">
          Wishlist
        </Link>

        <Link href="/my-orders">
          My Orders
        </Link>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {currentUser.name}
            </button>

            {showDropdown && (
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
            <Link href="/login">
              Login
            </Link>

            <Link href="/register">
              Register
            </Link>
          </>
        )}

      </nav>

    </header>
  );
}