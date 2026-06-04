"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(async (r) => {
        const text = await r.text();
        if (!text) return [];
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [];
      })
      .then((all) => setProducts(all.slice(0, 8)))
      .catch((err) => {
        console.error("Featured products error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked just for you</p>
          </div>
          <Link href="/products/category/electronics" className="text-indigo-600 font-semibold hover:underline text-sm">
            View All →
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-5 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg">No products available yet.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
