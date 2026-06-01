"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { cart, addToCart, isInCart } = useCartStore();
  const { wishlist, addToWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addToCart(product);
  };

  const handleAddToWishlist = (product: Product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addToWishlist(product);
  };

  const buyNow = (product: Product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addToCart(product);
    router.push("/cart");
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-indigo-600 mb-2">${product.price}</p>
                <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                    isInCart(product._id) || product.stock === 0
                      ? "bg-gray-800 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={() => buyNow(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                    product.stock === 0
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleAddToWishlist(product)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                    isInWishlist(product._id)
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isInWishlist(product._id) ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
