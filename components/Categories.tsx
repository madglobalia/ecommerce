import Link from "next/link";

const CATEGORIES = [
  { label: "Electronics",     slug: "electronics",     emoji: "📱", color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
  { label: "Clothing",        slug: "clothing",        emoji: "👗", color: "text-pink-600",    bg: "bg-pink-50",    border: "border-pink-100" },
  { label: "Footwear",        slug: "footwear",        emoji: "👟", color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-100" },
  { label: "Computers",       slug: "computers",       emoji: "💻", color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
  { label: "Furniture",       slug: "furniture",       emoji: "🛋️", color: "text-yellow-600",  bg: "bg-yellow-50",  border: "border-yellow-100" },
  { label: "Kitchen",         slug: "kitchen",         emoji: "🍳", color: "text-green-600",   bg: "bg-green-50",   border: "border-green-100" },
  { label: "Beauty",          slug: "beauty",          emoji: "💄", color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-100" },
  { label: "Sports",          slug: "sports",          emoji: "⚽", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function Categories() {
  return (
    <section className="py-14 px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              className="group flex flex-col items-center"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.bg} border-2 ${cat.border} flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                {cat.emoji}
              </div>
              <p className={`mt-3 text-sm font-semibold text-gray-700 group-hover:${cat.color} text-center transition-colors`}>
                {cat.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products">
            <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold px-8 py-2.5 rounded-xl transition-all">
              View All Categories →
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
