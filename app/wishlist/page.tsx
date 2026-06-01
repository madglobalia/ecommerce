"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const moveToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      const newCart = [...cart, product];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
    removeFromWishlist(product.id);
  };

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      const newCart = [...cart, product];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      alert(`${product.title} added to cart!`);
    } else {
      alert(`${product.title} is already in cart!`);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Wishlist ❤️</h1>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to your wishlist!</p>
            <a
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col"
              >
                <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-6xl mb-4">
                  {product.image}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-indigo-600 mb-4">₹{product.price.toLocaleString()}</p>

                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}