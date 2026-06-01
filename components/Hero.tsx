import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gray-100 h-[500px] flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-6xl font-bold">
          Welcome To MyShop
        </h1>

        <p className="mt-5 text-xl">
          Best Ecommerce Store
        </p>

        <Link href="/products">
          <button className="bg-black text-white px-6 py-3 mt-5 rounded">

            Shop Now

          </button>
        </Link>

      </div>

    </section>
  );
}