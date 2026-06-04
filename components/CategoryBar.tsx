"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Electronics",     slug: "electronics",     emoji: "📱" },
  { label: "Clothing",        slug: "clothing",        emoji: "👗" },
  { label: "Footwear",        slug: "footwear",        emoji: "👟" },
  { label: "Computers",       slug: "computers",       emoji: "💻" },
  { label: "Furniture",       slug: "furniture",       emoji: "🛋️" },
  { label: "Kitchen",         slug: "kitchen",         emoji: "🍳" },
  { label: "Beauty",          slug: "beauty",          emoji: "💄" },
  { label: "Sports",          slug: "sports",          emoji: "⚽" },
  { label: "Accessories",     slug: "accessories",     emoji: "⌚" },
  { label: "Home Appliances", slug: "home-appliances", emoji: "🏠" },
  { label: "Tools",           slug: "tools",           emoji: "🔧" },
];

export default function CategoryBar() {
  const pathname = usePathname();

  const activeSlug = pathname.startsWith("/products/category/")
    ? pathname.split("/products/category/")[1]
    : null;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/products/category/${cat.slug}`}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-1 border-b-2 transition-all group ${
                  isActive
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-transparent hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform block">
                  {cat.emoji}
                </span>
                <span
                  className={`text-xs font-medium mt-1 text-center leading-tight ${
                    isActive ? "text-indigo-600" : "text-gray-600 group-hover:text-indigo-500"
                  }`}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
