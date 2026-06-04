import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white border-b border-gray-100 min-h-[480px] flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full py-16">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            New Arrivals Every Week
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Shop the Latest
            <span className="block text-indigo-600">
              Trends &amp; Deals
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Discover thousands of products across top categories —
            electronics, fashion, footwear, and more. Best prices guaranteed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products/category/electronics">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5">
                Shop Now →
              </button>
            </Link>
            <Link href="/products">
              <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all">
                Browse Categories
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            {[
              { value: "10K+", label: "Products" },
              { value: "5K+",  label: "Happy Customers" },
              { value: "Free", label: "Shipping" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
