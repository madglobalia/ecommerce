import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white">

      {/* Categories */}
      <Categories />

      {/* Promo Badges */}
      <section className="py-10 px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <span className="text-3xl">🚚</span>
              <div>
                <p className="font-bold text-gray-800">Free Shipping</p>
                <p className="text-gray-500 text-sm">On all orders</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-2xl p-5">
              <span className="text-3xl">🔒</span>
              <div>
                <p className="font-bold text-gray-800">Secure Payment</p>
                <p className="text-gray-500 text-sm">100% safe &amp; secure</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <span className="text-3xl">↩️</span>
              <div>
                <p className="font-bold text-gray-800">Easy Returns</p>
                <p className="text-gray-500 text-sm">7-day return policy</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Bottom CTA */}
      <section className="py-16 px-8 bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to start shopping?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Thousands of products waiting for you. New deals added every day.
          </p>
          <Link href="/products/category/electronics">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-md hover:-translate-y-1">
              Start Shopping →
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}
