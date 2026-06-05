"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  category: string;
}

const ITEMS_PER_PAGE = 10;

const CATEGORY_META: Record<string, { label: string; emoji: string; bg: string }> = {
  electronics:       { label: "Electronics",    emoji: "📱", bg: "from-blue-500 to-indigo-600" },
  clothing:          { label: "Clothing",        emoji: "👗", bg: "from-pink-500 to-rose-600" },
  footwear:          { label: "Footwear",        emoji: "👟", bg: "from-orange-500 to-amber-600" },
  computers:         { label: "Computers",       emoji: "💻", bg: "from-violet-500 to-purple-600" },
  furniture:         { label: "Furniture",       emoji: "🛋️", bg: "from-yellow-500 to-orange-600" },
  kitchen:           { label: "Kitchen",         emoji: "🍳", bg: "from-green-500 to-teal-600" },
  beauty:            { label: "Beauty",          emoji: "💄", bg: "from-fuchsia-500 to-pink-600" },
  sports:            { label: "Sports",          emoji: "⚽", bg: "from-emerald-500 to-green-600" },
  accessories:       { label: "Accessories",     emoji: "⌚", bg: "from-cyan-500 to-blue-600" },
  "home appliances": { label: "Home Appliances", emoji: "🏠", bg: "from-red-500 to-orange-600" },
  tools:             { label: "Tools",           emoji: "🔧", bg: "from-gray-500 to-slate-600" },
};

function getCategoryMeta(slug: string) {
  const key = slug.toLowerCase().replace(/-/g, " ");
  return CATEGORY_META[key] || {
    label: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    emoji: "📦",
    bg: "from-indigo-500 to-purple-600",
  };
}

function slugToCategory(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const meta = getCategoryMeta(slug);
  const categoryName = slugToCategory(slug);

  // Pagination
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!slug) return;
    setCurrentPage(1);
    setLoading(true);
    const controller = new AbortController();
    fetch(`/api/products?category=${encodeURIComponent(categoryName)}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        const text = await r.text();
        if (!text || !text.trim()) return [];
        try {
          const data = JSON.parse(text);
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        if (err.name !== "AbortError") { console.error(err); setProducts([]); }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{meta.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{meta.label}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">{meta.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No {meta.label} products yet
            </h2>
            <p className="text-gray-500">Check back later or browse other categories.</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  categoryBg={meta.bg}
                  categoryEmoji={meta.emoji}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              label="products"
            />
          </>
        )}

      </div>
    </div>
  );
}
